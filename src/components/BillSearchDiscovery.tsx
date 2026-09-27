import React, { useState } from 'react';
import { Bill } from '../types/civic';
import { Search, ExternalLink, Loader2, ArrowRight, Check, FilePlus2 } from 'lucide-react';

interface BillSearchDiscoveryProps {
  bills: Bill[];
  selectedBill: Bill;
  onSelectBill: (bill: Bill) => void;
  onOpenCustomBill: () => void;
  onSelectPersonaForAction?: (persona: string, concern: string) => void;
}

interface OpenParliamentResult {
  session: string;
  number: string;
  name: { en: string; fr?: string };
  short_title?: { en: string; fr?: string };
  status: { en: string };
  status_code?: string;
  introduced?: string;
  legisinfo_url?: string;
  text_url?: string;
  sponsor_politician_url?: string;
  law?: boolean | null;
  url?: string;
}

const PRESET_TOPICS = [
  { label: '🔥 Bill C-34 (Safe Social Media)', query: 'C-34' },
  { label: '⛽ Bill C-38 (Fuel Relief)', query: 'fuel' },
  { label: '🏠 Bill C-20 (Build Canada Homes)', query: 'C-20' },
  { label: '🤖 Bill C-27 (AI & Privacy)', query: 'C-27' },
  { label: '🔒 Bill C-8 (Cyber Security)', query: 'C-8' },
  { label: '🌱 Bill C-59 (Anti-Greenwashing)', query: 'C-59' },
  { label: '🛡️ Bill C-70 (Foreign Interference)', query: 'C-70' },
];

export const BillSearchDiscovery: React.FC<BillSearchDiscoveryProps> = ({
  bills,
  selectedBill,
  onSelectBill,
  onOpenCustomBill,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [opResults, setOpResults] = useState<OpenParliamentResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [ingestingBillNumber, setIngestingBillNumber] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Search OpenParliament bills only
  const handlePerformSearch = async (queryText: string) => {
    const term = queryText.trim();
    if (!term) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      // Check local preset bills first for exact match
      const localMatch = bills.find(
        (b) =>
          b.code.toLowerCase().includes(term.toLowerCase()) ||
          b.popularName.toLowerCase().includes(term.toLowerCase()) ||
          b.title.toLowerCase().includes(term.toLowerCase())
      );
      if (localMatch && term.length <= 6) {
        onSelectBill(localMatch);
      }

      // Query OpenParliament bills via our cached backend route
      const resp = await fetch(`/api/openparliament/bills?q=${encodeURIComponent(term)}&limit=30`);
      if (!resp.ok) throw new Error('Search failed');
      const data = await resp.json();
      setOpResults(data.objects || []);
    } catch (err: any) {
      setSearchError('Could not complete search. Please try again.');
      setOpResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePerformSearch(searchQuery);
  };

  const handleSelectPreset = (query: string) => {
    setSearchQuery(query);
    handlePerformSearch(query);
  };

  // Ingest any OpenParliament bill into Civic Lens
  const handleIngestOpBill = async (opBill: OpenParliamentResult) => {
    // Check if we already have it in local bills
    const localMatch = bills.find(
      (b) => b.code.toLowerCase() === `bill ${opBill.number.toLowerCase()}`
    );
    if (localMatch) {
      onSelectBill(localMatch);
      return;
    }

    setIngestingBillNumber(opBill.number);
    try {
      const resp = await fetch('/api/ingest-openparliament-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: opBill.number,
          session: opBill.session,
          name: opBill.name?.en,
          short_title: opBill.short_title?.en,
          status: opBill.status?.en,
          legisinfo_url: opBill.legisinfo_url,
          sponsor_name: opBill.sponsor_politician_url
            ? opBill.sponsor_politician_url.replace(/\/politicians\/|\//g, ' ').replace(/-/g, ' ').trim()
            : 'Member of Parliament',
        }),
      });

      if (!resp.ok) throw new Error('Failed to analyze bill');
      const newDossier: Bill = await resp.json();
      onSelectBill(newDossier);
    } catch (err) {
      console.error('Error ingesting bill:', err);
    } finally {
      setIngestingBillNumber(null);
    }
  };

  return (
    <section className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Search Bar Container */}
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 mb-3">
            Find Any Bill or Legal Topic
          </h2>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by bill number (e.g. C-38, C-34, C-20, C-8) or topic (e.g. fuel, social media, housing, privacy)..."
                className="w-full pl-10 pr-24 py-3 bg-[#FBF9F5] border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/40 focus:border-amber-800 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 px-1 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Parliament</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Chips & Ingest Custom Bill underneath search bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-500 font-sans font-medium">Quick Select:</span>
              {PRESET_TOPICS.map((p) => (
                <button
                  key={p.query}
                  type="button"
                  onClick={() => handleSelectPreset(p.query)}
                  className={`px-2.5 py-1 rounded-md border text-xs font-sans transition-all ${
                    selectedBill.code.toLowerCase().includes(p.query.toLowerCase()) ||
                    (p.query === 'fuel' && selectedBill.code.toLowerCase().includes('c-38'))
                      ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenCustomBill}
              className="px-3 py-1 text-xs font-medium text-amber-900 hover:text-amber-950 border border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-amber-800" />
              <span>Ingest Custom Bill</span>
            </button>
          </div>
        </div>

        {/* Search Results (OpenParliament Only) */}
        {hasSearched && (
          <div className="border border-stone-200 rounded-lg bg-[#FAF8F5] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-2.5">
              <div className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                Parliamentary Search Results for "{searchQuery}" ({opResults.length} bills found)
              </div>
              <button
                type="button"
                onClick={() => setHasSearched(false)}
                className="text-xs text-stone-400 hover:text-stone-700 font-medium"
              >
                Close Results
              </button>
            </div>

            {searchError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                {searchError}
              </div>
            )}

            {opResults.length === 0 ? (
              <p className="text-xs text-stone-500 py-3">
                No matching parliamentary bills found on OpenParliament for "{searchQuery}". Try searching for bill numbers (e.g. "C-38", "C-34", "C-20") or keywords like "fuel", "tax", "housing", "social".
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {opResults.map((b, i) => {
                  const isCurrentActive = selectedBill.code.toLowerCase() === `bill ${b.number.toLowerCase()}`;
                  const isIngesting = ingestingBillNumber === b.number;

                  return (
                    <div
                      key={`${b.session}-${b.number}-${i}`}
                      className={`p-3.5 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                        isCurrentActive
                          ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/40'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-stone-900 text-sm">
                              Bill {b.number}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-mono">
                              {b.session}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            b.law || b.status?.en?.toLowerCase().includes('royal assent')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {b.status?.en || 'Under Study'}
                          </span>
                        </div>

                        <h4 className="font-serif font-medium text-stone-900 text-sm mb-1 leading-snug line-clamp-2">
                          {b.short_title?.en || b.name?.en}
                        </h4>
                        <p className="text-stone-500 text-[11px] line-clamp-2 mb-3">
                          {b.name?.en}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[11px]">
                          {b.legisinfo_url && (
                            <a
                              href={b.legisinfo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-stone-500 hover:text-stone-800 flex items-center gap-1"
                            >
                              <span>LEGISinfo</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          <a
                            href={`https://openparliament.ca/bills/${b.session}/${b.number}/`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-stone-500 hover:text-stone-800 flex items-center gap-1"
                          >
                            <span>OpenParliament</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleIngestOpBill(b)}
                          disabled={isIngesting}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                            isCurrentActive
                              ? 'bg-amber-800 text-white cursor-default'
                              : 'bg-stone-900 hover:bg-stone-800 text-white'
                          }`}
                        >
                          {isIngesting ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Analyzing...</span>
                            </>
                          ) : isCurrentActive ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Active Bill</span>
                            </>
                          ) : (
                            <>
                              <span>Analyze Bill</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Selected Bill Overview Ribbon */}
        <div className="p-4 sm:p-5 bg-[#F7F4EE] border border-stone-200/90 rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-stone-900 bg-white border border-stone-300 px-2 py-0.5 rounded">
                {selectedBill.code}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600 font-medium">{selectedBill.parliamentSession}</span>
              <span className="text-stone-400">·</span>
              <span className="text-amber-800 font-medium">Sponsor: {selectedBill.sponsor.name} ({selectedBill.sponsor.party})</span>
              <span className="text-stone-400">·</span>
              <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded text-[11px]">
                {selectedBill.currentStage}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-serif font-semibold text-stone-900 leading-snug">
              {selectedBill.popularName}
            </h3>

            <p className="text-xs sm:text-sm text-stone-700 max-w-3xl leading-relaxed">
              {selectedBill.summaryPlain}
            </p>
          </div>

          {/* Quick External Links: LEGISinfo FIRST, then OpenParliament */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200">
            {(() => {
              const sessionMatch = selectedBill.parliamentSession.match(/(\d+)(?:st|nd|rd|th)\s+Parliament,\s+(\d+)(?:st|nd|rd|th)\s+Session/i);
              const sessionCode = sessionMatch ? `${sessionMatch[1]}-${sessionMatch[2]}` : (selectedBill.parliamentSession.includes('44') ? '44-1' : '45-1');
              const cleanNum = selectedBill.code.replace(/^BILL\s+/i, '').trim();
              const billLegisinfoUrl = cleanNum ? `https://www.parl.ca/legisinfo/en/bill/${sessionCode}/${cleanNum}` : null;

              if (!billLegisinfoUrl) return null;

              return (
                <a
                  href={billLegisinfoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  <span>LEGISinfo Official</span>
                </a>
              );
            })()}
            <a
              href={`https://openparliament.ca/search/?q=${encodeURIComponent(selectedBill.code)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-md transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              <span>OpenParliament Hansard</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
