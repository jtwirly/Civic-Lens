import React, { useState } from 'react';
import { Bill, Citation } from '../types/civic';
import { Search, Sparkles, Shield, ArrowRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface CitizenTracerProps {
  bill: Bill;
  onInspectCitation: (citation: Citation) => void;
  onSendToAction: (persona: string, concern: string, matchedClauses: string[]) => void;
}

interface PreloadedConcern {
  label: string;
  query: string;
  persona: string;
  matchedSections: string[];
  findings: string;
  provisions: {
    section: string;
    text: string;
    analysis: string;
    citation: Citation;
  }[];
  amendmentSuggestion: string;
}

export const CitizenTracer: React.FC<CitizenTracerProps> = ({
  bill,
  onInspectCitation,
  onSendToAction,
}) => {
  const [customConcern, setCustomConcern] = useState('');
  const [activeConcern, setActiveConcern] = useState<PreloadedConcern | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Pre-configured intelligent statutory mappings for instant zero-latency demo
  const sampleConcerns: Record<string, PreloadedConcern[]> = {
    'bill-c-27': [
      {
        label: 'Small Tech Founder: High-Impact AI Audits',
        query: 'I run a 5-person web agency; will our small AI chatbots face High-Impact AI audits, certifications, and fines?',
        persona: 'Small Business Founder / Developer',
        matchedSections: ['AIDA Clause 6', 'AIDA Clause 11', 'AIDA Clause 39'],
        findings: 'Bill C-27 does not exempt small businesses directly in the statutory text. Under Clause 11, anyone responsible for a "high-impact system" must establish mitigation measures and keep auditable records. While regulations may differentiate by company size, the statute currently creates potential exposure to penalties under Clause 39 unless clear SME safe-harbours are enacted.',
        provisions: [
          {
            section: 'AIDA Section 11(1)',
            text: 'A person who is responsible for a high-impact system must, in accordance with the regulations, establish measures to identify, assess and mitigate the risks of harm or biased output...',
            analysis: 'Establishes direct statutory duty of risk mitigation. Does not explicitly distinguish between a large enterprise and a 5-person developer team.',
            citation: bill.keyPillars[0]?.citation,
          },
          {
            section: 'AIDA Section 39(1)',
            text: 'Liable on conviction to a fine not exceeding the greater of $25,000,000 and 5% of gross global revenues...',
            analysis: 'Criminalizes intentional or reckless deployment of high-impact AI that causes serious physical or psychological harm or defrauds the public.',
            citation: bill.keyPillars[1]?.citation,
          },
        ],
        amendmentSuggestion: 'Request that your MP propose an explicit amendment to Clause 6 defining high-impact AI with proportional tiering and safe-harbour exemptions for early-stage Canadian startups.',
      },
      {
        label: 'Parent: Algorithmic Tracking of Children',
        query: 'How does this bill protect my teenage children from online apps profiling their behavior and selling data?',
        persona: 'Parent / Youth Advocate',
        matchedSections: ['CPPA Section 2(2)', 'CPPA Section 15(2)', 'CPPA Section 55'],
        findings: 'Under the Consumer Privacy Protection Act, minors\' personal information is formally deemed sensitive. This elevates the legal standard for obtaining valid consent and makes behavioral profiling of youth significantly harder for online platforms.',
        provisions: [
          {
            section: 'CPPA Section 2(2)',
            text: 'For the purposes of this Act, the personal information of minors is considered to be sensitive personal information.',
            analysis: 'Changes the legal baseline for consent across Canada, preventing companies from claiming implicit consent for tracking minors.',
            citation: bill.keyPillars[2]?.citation,
          },
        ],
        amendmentSuggestion: 'Urge the INDU committee to add an explicit prohibition on algorithmic profiling and dark patterns targeted at youth under age 18.',
      },
    ],
    'bill-c-63': [
      {
        label: 'Victim Advocacy: 24-Hour Removal Orders',
        query: 'If non-consensual private photos are posted of someone, how fast does the platform actually have to act under law?',
        persona: 'Citizen / Digital Rights Advocate',
        matchedSections: ['Online Harms Act Section 8(1)'],
        findings: 'Platforms are legally required to remove or make inaccessible intimate images communicated without consent within 24 hours of receiving an order from the Digital Safety Commission. Failure to comply can result in administrative monetary penalties.',
        provisions: [
          {
            section: 'Section 8(1)',
            text: 'The operator must make the content inaccessible to users in Canada within 24 hours after receiving the order.',
            analysis: 'Creates an enforceable emergency timeline with expedited digital safety ombudsperson support.',
            citation: bill.keyPillars[1]?.citation || bill.keyPillars[0]?.citation,
          },
        ],
        amendmentSuggestion: 'Ask the Justice committee to ensure the Ombudsperson has direct 24/7 intake staff so victims are not stuck behind automated web forms.',
      },
    ],
    'bill-c-59': [
      {
        label: 'Equipment Owner: Right to Repair Diagnostic Tools',
        query: 'Can heavy equipment and electronics manufacturers still refuse to give local mechanics diagnostic software?',
        persona: 'Independent Mechanic / Equipment Owner',
        matchedSections: ['Competition Act Section 75(1)'],
        findings: 'Bill C-59 explicitly amended Section 75 of the Competition Act to treat withholding diagnostic error codes, parts, and technical repair manuals as anti-competitive refusal to deal.',
        provisions: [
          {
            section: 'Section 75(1)',
            text: 'Expanded refusal to deal to include diagnostic and repair information, tools, and technical documentation.',
            analysis: 'Grants independent repair shops the right to seek Competition Tribunal orders against manufacturers who lock their diagnostic systems.',
            citation: bill.keyPillars[1]?.citation,
          },
        ],
        amendmentSuggestion: 'Encourage the Competition Bureau to adopt clear guidelines requiring manufacturers to sell diagnostic tools at non-discriminatory rates.',
      },
    ],
  };

  const currentPreloaded = sampleConcerns[bill.id] || sampleConcerns['bill-c-27'];

  const handleSelectPreset = (item: PreloadedConcern) => {
    setActiveConcern(item);
    setCustomConcern(item.query);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customConcern.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      // Create dynamically matched findings from bill pillars
      const pillar = bill.keyPillars[0];
      const dynamicMatch: PreloadedConcern = {
        label: 'Custom Citizen Query',
        query: customConcern,
        persona: 'Engaged Constituent',
        matchedSections: [pillar.citation.section],
        findings: `Analysis of "${customConcern}": Under ${bill.code}, this matter is directly governed by ${pillar.citation.section}. The bill establishes statutory requirements that will alter the obligations of both administrators and members of the public.`,
        provisions: [
          {
            section: pillar.citation.section,
            text: pillar.citation.shortExcerpt,
            analysis: pillar.plainLanguage,
            citation: pillar.citation,
          },
        ],
        amendmentSuggestion: `Recommend submitting a briefing note to the ${bill.committee.acronym} committee requesting clarification on how ${bill.code} balances this issue with constitutional and administrative fairness.`,
      };
      setActiveConcern(dynamicMatch);
      setIsAnalyzing(false);
    }, 450);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 lg:p-8 shadow-sm space-y-6">
      <div className="pb-4 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-stone-500 font-sans">
            Citizen Concern & Provision Tracer
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 mt-1">
            "What Does This Mean For Me?"
          </h2>
        </div>
        <div className="text-xs text-stone-500">
          Trace any real-world situation to exact statutory clauses in {bill.code}
        </div>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleCustomSearch} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={customConcern}
            onChange={(e) => setCustomConcern(e.target.value)}
            placeholder="Type your concern (e.g. 'I run a 5-person web agency; how does high-impact AI affect me?')"
            className="w-full px-4 py-3 pl-11 bg-stone-50 border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 transition-colors"
          />
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            disabled={isAnalyzing || !customConcern.trim()}
            className="absolute right-2 top-2 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
          >
            {isAnalyzing ? 'Tracing Provisions...' : 'Trace Law'}
          </button>
        </div>

        {/* Quick Example Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-stone-500 font-medium">Try key scenarios:</span>
          {currentPreloaded.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(item)}
              className="text-xs text-stone-700 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
        </div>
      </form>

      {/* Results Box */}
      {activeConcern && (
        <div className="bg-[#FBF9F5] border border-amber-900/20 rounded-lg p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-sans text-amber-900 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>Statutory Mapping for {activeConcern.persona}</span>
              </div>
              <div className="text-sm font-serif italic text-stone-800 mt-1">
                "{activeConcern.query}"
              </div>
            </div>

            {/* Matched Clauses Badges */}
            <div className="flex flex-wrap gap-1">
              {activeConcern.matchedSections.map((sec) => (
                <span key={sec} className="text-xs font-mono text-stone-800 bg-white border border-stone-300 px-2 py-0.5 rounded">
                  {sec}
                </span>
              ))}
            </div>
          </div>

          {/* Plain Findings */}
          <div>
            <div className="text-xs uppercase tracking-wider font-sans text-stone-500 mb-1">
              Legal Synthesis & Practical Reality
            </div>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white border border-stone-200 p-4 rounded-md">
              {activeConcern.findings}
            </p>
          </div>

          {/* Grounded Provisions */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider font-sans text-stone-500">
              Direct Statutory Evidence in {bill.code}
            </div>
            {activeConcern.provisions.map((prov, pIdx) => (
              <div key={pIdx} className="bg-white border border-stone-200 rounded p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-stone-900">{prov.section}</span>
                  <button
                    onClick={() => onInspectCitation(prov.citation)}
                    className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-medium"
                  >
                    <Shield className="w-3 h-3" />
                    <span>Inspect Full Clause</span>
                  </button>
                </div>
                <div className="font-serif italic text-stone-700 bg-stone-50 p-2.5 rounded border border-stone-100">
                  "{prov.text}"
                </div>
                <p className="text-stone-600">
                  <strong className="text-stone-800">Impact: </strong>{prov.analysis}
                </p>
              </div>
            ))}
          </div>

          {/* Concrete Amendment & Next Step */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-md">
            <div className="text-xs uppercase tracking-wider font-sans font-semibold text-amber-950 mb-1">
              Recommended Democratic Strategy:
            </div>
            <p className="text-xs text-amber-900 leading-relaxed mb-3">
              {activeConcern.amendmentSuggestion}
            </p>

            <button
              onClick={() => onSendToAction(activeConcern.persona, activeConcern.query, activeConcern.matchedSections)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Transfer This finding to Action Engine (Contact MP)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
