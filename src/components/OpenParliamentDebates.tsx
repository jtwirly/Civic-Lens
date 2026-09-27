import React, { useState, useEffect } from 'react';
import { Bill } from '../types/civic';
import { Landmark, Vote, MessageSquare, ExternalLink, Loader2, Info } from 'lucide-react';

interface OpenParliamentDebatesProps {
  bill: Bill;
}

interface SpeechItem {
  time?: string;
  politician_url?: string;
  content?: { en: string };
  h1?: { en: string };
  h2?: { en: string };
  url?: string;
}

interface VoteItem {
  number: number;
  session: string;
  date: string;
  description: { en: string };
  result: string;
  yea_total: number;
  nay_total: number;
  paired_total: number;
  url: string;
  bill_url?: string;
}

export const OpenParliamentDebates: React.FC<OpenParliamentDebatesProps> = ({ bill }) => {
  const [speeches, setSpeeches] = useState<SpeechItem[]>([]);
  const [votes, setVotes] = useState<VoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchParliamentData = async () => {
      setIsLoading(true);
      try {
        const cleanNumber = bill.code.replace(/^BILL\s+/i, '').trim();

        // Extract session code e.g. "45-1" or "44-1"
        const sessionMatch = bill.parliamentSession.match(/(\d+)(?:st|nd|rd|th)\s+Parliament,\s+(\d+)(?:st|nd|rd|th)\s+Session/i);
        const sessionParam = sessionMatch ? `${sessionMatch[1]}-${sessionMatch[2]}` : (bill.parliamentSession.includes('44') ? '44-1' : '45-1');

        // 1. Fetch division votes strictly for this bill and session
        const votesResp = await fetch(`/api/openparliament/votes?bill=${encodeURIComponent(cleanNumber)}&session=${encodeURIComponent(sessionParam)}&limit=10`)
          .then((r) => r.ok ? r.json() : { objects: [] })
          .catch(() => ({ objects: [] }));

        // 2. Fetch debates / speeches strictly mentioning this bill
        const debatesResp = await fetch(`/api/openparliament/debates?bill=${encodeURIComponent(bill.code)}&limit=8`)
          .then((r) => r.ok ? r.json() : { objects: [] })
          .catch(() => ({ objects: [] }));

        setVotes(votesResp.objects || []);
        setSpeeches(debatesResp.objects || []);
      } catch (err) {
        console.error('Error fetching OpenParliament data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParliamentData();
  }, [bill.id, bill.code, bill.parliamentSession]);

  const cleanNum = bill.code.replace(/^BILL\s+/i, '').trim();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 font-sans">
          <Landmark className="w-4 h-4 text-amber-800" />
          <span className="font-semibold text-stone-900">Parliamentary Records & Hansard</span>
          <span>·</span>
          <span className="text-amber-800">Source: api.openparliament.ca</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900">
          Chamber Debates & Recorded Votes for {bill.code}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Verbatim records of parliamentary debate on {bill.code} ({bill.popularName.split('(')[0]}), and official division votes cast in the House of Commons.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-lg border border-stone-200">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-800 mb-2" />
          <p className="text-xs text-stone-600 font-sans">Loading parliamentary division records and debate transcripts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recorded Votes */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Vote className="w-4 h-4 text-amber-800" />
                <h3 className="font-serif font-semibold text-stone-900 text-base">Recorded Division Votes</h3>
              </div>
              <span className="text-xs font-mono text-stone-400">{votes.length} votes</span>
            </div>

            {votes.length === 0 ? (
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 text-xs space-y-2">
                <div className="flex items-center gap-2 text-stone-700 font-medium">
                  <Info className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>No recorded roll-call votes for {bill.code} yet</span>
                </div>
                <p className="text-stone-500 leading-relaxed pl-6">
                  {bill.code} is currently at <strong>{bill.currentStage}</strong>. Formal division roll-call votes in the House of Commons typically take place at the conclusion of Second Reading, Committee Report Stage, and Third Reading.
                </p>
                <div className="pt-2 pl-6">
                  <a
                    href={`https://openparliament.ca/search/?q=${encodeURIComponent(bill.code)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-800 hover:text-amber-950 font-medium inline-flex items-center gap-1"
                  >
                    <span>Check OpenParliament for updates</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {votes.map((v) => (
                  <div key={`${v.session}-${v.number}`} className="p-3.5 bg-stone-50 rounded border border-stone-200/80 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-stone-700">Vote #{v.number} ({v.session})</span>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        v.result === 'Passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {v.result}
                      </span>
                    </div>

                    <p className="text-stone-900 font-medium leading-snug">
                      {v.description.en}
                    </p>

                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-stone-600 font-mono text-[11px]">
                      <span>Yeas: <strong className="text-emerald-700">{v.yea_total}</strong> · Nays: <strong className="text-rose-700">{v.nay_total}</strong></span>
                      <a
                        href={`https://openparliament.ca${v.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-800 hover:text-amber-950 font-sans font-medium flex items-center gap-1"
                      >
                        <span>Full Roll Call</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hansard Speeches / Debates */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-800" />
                <h3 className="font-serif font-semibold text-stone-900 text-base">House of Commons Debates</h3>
              </div>
              <span className="text-xs font-mono text-stone-400">{speeches.length} transcripts</span>
            </div>

            {speeches.length === 0 ? (
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 text-xs space-y-2">
                <div className="flex items-center gap-2 text-stone-700 font-medium">
                  <Info className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>No debate speeches indexed yet for {bill.code}</span>
                </div>
                <p className="text-stone-500 leading-relaxed pl-6">
                  Debate transcripts are indexed after Hansard daily publications are finalized by the House of Commons.
                </p>
                <div className="pt-2 pl-6">
                  <a
                    href={`https://openparliament.ca/search/?q=${encodeURIComponent(bill.code)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-800 hover:text-amber-950 font-medium inline-flex items-center gap-1"
                  >
                    <span>Search all mentions of {bill.code} on OpenParliament</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {speeches.map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-stone-50 rounded border border-stone-200/80 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-serif font-semibold text-stone-900 text-xs">
                        {s.politician_url ? s.politician_url.replace(/\/politicians\/|\//g, ' ').replace(/-/g, ' ').trim() : 'House of Commons'}
                      </span>
                      <span className="font-mono">{s.time?.slice(0, 10)}</span>
                    </div>

                    {s.content?.en && (
                      <div
                        className="text-stone-700 text-xs italic leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: s.content.en }}
                      />
                    )}

                    {s.url && (
                      <div className="pt-1.5 border-t border-stone-200/60 flex justify-end">
                        <a
                          href={`https://openparliament.ca${s.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 text-[11px]"
                        >
                          <span>Read Full Speech</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
