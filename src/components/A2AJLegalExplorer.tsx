import React, { useState, useEffect } from 'react';
import { Bill } from '../types/civic';
import { Scale, Search, ExternalLink, BookOpen, FileText, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface A2AJLegalExplorerProps {
  bill: Bill;
}

interface LegalItem {
  dataset: string;
  citation_en: string;
  citation2_en?: string;
  name_en: string;
  document_date_en: string;
  url_en?: string;
  source_url_en?: string;
  snippet?: string;
  score?: number;
  citing_cases_count?: number;
  upstream_license?: string;
}

export const A2AJLegalExplorer: React.FC<A2AJLegalExplorerProps> = ({ bill }) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Existing Statutes (Laws) FIRST, Court Decisions (Cases) SECOND
  const [docType, setDocType] = useState<'laws' | 'cases'>('laws');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LegalItem[]>([]);

  // Track expanded excerpts per item by citation
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);
  const [excerptLoading, setExcerptLoading] = useState(false);
  const [excerptTexts, setExcerptTexts] = useState<Record<string, string>>({});

  // Derive smart default queries based on active bill
  const getInitialQuery = () => {
    if (bill.code.toLowerCase().includes('c-38')) return 'Excise Tax fuel';
    if (bill.code.toLowerCase().includes('c-34')) return 'freedom of expression social media';
    if (bill.code.toLowerCase().includes('c-20')) return 'right to housing';
    if (bill.code.toLowerCase().includes('c-27')) return 'privacy personal information';
    if (bill.code.toLowerCase().includes('c-59')) return 'competition greenwashing';
    return bill.popularName.split('(')[0].trim();
  };

  useEffect(() => {
    const defaultQuery = getInitialQuery();
    setSearchTerm(defaultQuery);
    executeSearch(defaultQuery, docType);
  }, [bill.id]);

  const executeSearch = async (queryText: string, type: 'laws' | 'cases') => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setExpandedCitation(null);

    try {
      const resp = await fetch(
        `/api/a2aj/search?query=${encodeURIComponent(queryText)}&doc_type=${type}&size=8`
      );
      if (!resp.ok) throw new Error('Search failed');
      const data = await resp.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Error fetching A2AJ legal data:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleExcerpt = async (item: LegalItem) => {
    const citationKey = item.citation_en || item.name_en;

    // Toggle close if already open
    if (expandedCitation === citationKey) {
      setExpandedCitation(null);
      return;
    }

    setExpandedCitation(citationKey);

    // Initial instant fallback to snippet
    const cleanSnippet = item.snippet ? item.snippet.replace(/<[^>]*>?/gm, '').trim() : '';
    if (!excerptTexts[citationKey]) {
      setExcerptTexts((prev) => ({
        ...prev,
        [citationKey]: cleanSnippet || `Official Citation: ${item.citation_en}. Enacted under Canadian federal statutory jurisdiction. Consult Justice Laws Canada or OpenParliament for the full consolidated provisions.`,
      }));
    }

    // Attempt fast background fetch for full unabridged provisions
    if (!excerptTexts[citationKey] || excerptTexts[citationKey] === cleanSnippet) {
      setExcerptLoading(true);
      try {
        const resp = await fetch(
          `/api/a2aj/fetch?citation=${encodeURIComponent(item.citation_en)}&doc_type=${docType}`
        );
        if (resp.ok) {
          const data = await resp.json();
          const text = data.results?.[0]?.unofficial_text_en;
          if (text && text.trim()) {
            setExcerptTexts((prev) => ({
              ...prev,
              [citationKey]: text.slice(0, 2500) + (text.length > 2500 ? '\n\n[... Full statutory section continues. Open source below for complete text]' : ''),
            }));
          }
        }
      } catch (err) {
        // Keep existing snippet
      } finally {
        setExcerptLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900">
              Related Statutes and Case Law Precedents
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Relevant Canadian federal statutes and judicial precedents interpreting {bill.code}
            </p>
          </div>

          {/* Switch order: Existing Statutes (Laws) FIRST, Court Decisions (Cases) SECOND */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg shrink-0">
            <button
              onClick={() => {
                setDocType('laws');
                executeSearch(searchTerm, 'laws');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                docType === 'laws'
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Existing Statutes (Laws)
            </button>
            <button
              onClick={() => {
                setDocType('cases');
                executeSearch(searchTerm, 'cases');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                docType === 'cases'
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Court Decisions (Cases)
            </button>
          </div>
        </div>

        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch(searchTerm, docType);
          }}
          className="flex items-center gap-2 pt-1"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search statutes or precedents (e.g. Excise Tax, privacy, freedom of expression)..."
              className="w-full pl-9 pr-4 py-2 bg-[#FBF9F5] border border-stone-300 rounded-md text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800 font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-lg border border-stone-200">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-800 mb-2" />
          <p className="text-xs text-stone-600 font-sans">Retrieving Canadian legal records...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg border border-stone-200 text-stone-500 text-xs">
          No records found for "{searchTerm}". Try general terms like "tax", "privacy", "freedom of expression", or "housing".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((r, idx) => {
            const isExpanded = expandedCitation === r.citation_en;
            const primaryUrl = r.source_url_en || r.url_en;

            return (
              <div
                key={`${r.citation_en}-${idx}`}
                className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {r.citation_en}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
                      <span className="font-semibold text-stone-700">{r.dataset}</span>
                      {r.document_date_en && (
                        <>
                          <span>·</span>
                          <span>{r.document_date_en.slice(0, 10)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="font-serif font-semibold text-stone-900 text-base mb-2 leading-snug">
                    {r.name_en}
                  </h3>

                  {r.snippet && (
                    <div
                      className="p-3 bg-stone-50 rounded border border-stone-100 text-xs text-stone-700 italic leading-relaxed mb-3 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: `"...${r.snippet}..."` }}
                    />
                  )}

                  {/* Inline Excerpt Accordion */}
                  {isExpanded && (
                    <div className="mt-3 p-3.5 bg-amber-50/50 border border-amber-200/70 rounded-md space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-sans pb-1.5 border-b border-amber-200/50">
                        <span className="font-semibold text-amber-950 uppercase tracking-wider">
                          Statutory & Judicial Text Excerpt
                        </span>
                        <a
                          href={`https://openparliament.ca/search/?q=${encodeURIComponent(r.name_en)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-900 hover:text-amber-950 font-medium inline-flex items-center gap-1"
                        >
                          <span>OpenParliament Records</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      
                      <div className="text-xs font-mono text-stone-800 max-h-64 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                        {excerptTexts[r.citation_en || r.name_en] || (
                          excerptLoading ? (
                            <div className="flex items-center gap-2 text-stone-500 py-3">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Loading legal excerpt...</span>
                            </div>
                          ) : (
                            'Excerpt loaded.'
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-3">
                  <div className="text-stone-500 text-[11px]">
                    {r.citing_cases_count !== undefined ? (
                      <span className="font-medium text-stone-700">
                        {r.citing_cases_count} cases citing
                      </span>
                    ) : (
                      <span>Federal Statutory Record</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleExcerpt(r)}
                      className="px-2.5 py-1 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded transition-colors flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Excerpt' : 'View Excerpt'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {primaryUrl && (
                      <a
                        href={primaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition-colors flex items-center gap-1"
                      >
                        <span>Official Source</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
