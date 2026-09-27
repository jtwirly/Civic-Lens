import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, ShieldCheck, Scale, FileText } from 'lucide-react';
import { Citation } from '../types/civic';

interface CitationDrawerProps {
  citation: Citation | null;
  onClose: () => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({ citation, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!citation) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${citation.section} - ${citation.actName}\n\n${citation.fullClauseText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-stone-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-[#FBF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            <div>
              <div className="text-xs uppercase tracking-wider font-sans text-stone-500 font-medium">
                Verified Statutory Source
              </div>
              <h3 className="text-base font-serif font-semibold text-stone-900">
                {citation.section}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200/60 transition-colors"
            aria-label="Close citation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Proof Seal & Context */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-md text-emerald-950 text-xs leading-relaxed flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-emerald-900">Zero Hallucination Verification:</strong> Every insight produced by Civic Lens is matched directly against the official Parliament of Canada First/Second Reading text and Hansard committee records.
            </div>
          </div>

          {/* Act & Section Reference */}
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-500 font-sans mb-1">
              Enacting Statute
            </div>
            <div className="text-sm font-medium text-stone-900">
              {citation.actName}
            </div>
            <div className="text-xs text-stone-500 font-mono mt-0.5">
              Citation Ref: {citation.section}
            </div>
          </div>

          {/* Verbatim Statutory Text */}
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-stone-500 font-sans mb-2">
              <span>Official Statutory Text</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-stone-600 hover:text-stone-950 transition-colors normal-case font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to clipboard' : 'Copy clause'}</span>
              </button>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-md font-serif text-sm text-stone-800 leading-relaxed italic select-text">
              "{citation.fullClauseText}"
            </div>
          </div>

          {/* Plain English Legal Interpretation */}
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-500 font-sans mb-1.5">
              Legal Context & Enforceability
            </div>
            <p className="text-xs text-stone-700 leading-relaxed bg-white border border-stone-200 p-3.5 rounded-md">
              {citation.legalContext}
            </p>
          </div>

          {/* Cross References & Hansard */}
          <div className="pt-2 border-t border-stone-200">
            <div className="text-xs uppercase tracking-wider text-stone-500 font-sans mb-2">
              Official Parliamentary Links
            </div>
            <div className="space-y-2">
              <a
                href={`https://laws-lois.justice.gc.ca/eng/acts/`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 text-xs text-stone-700 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span>Consolidated Statutes on Justice Laws Canada</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
              </a>

              <a
                href={`https://openparliament.ca/search/?q=${encodeURIComponent(citation.actName)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 text-xs text-stone-700 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span>Search {citation.actName} on OpenParliament</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
              </a>

              <a
                href="https://parlvu.parl.gc.ca"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 text-xs text-stone-700 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-stone-500" />
                  <span>Watch Committee Debates on ParlVU</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Parliament of Canada Public Record</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-stone-700 font-medium hover:text-stone-900 border border-stone-300 rounded bg-white"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
