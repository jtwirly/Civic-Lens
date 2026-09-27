import React, { useState } from 'react';
import { X, Sparkles, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Bill } from '../types/civic';

interface CustomBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBillAnalyzed: (newBill: Bill) => void;
}

export const CustomBillModal: React.FC<CustomBillModalProps> = ({
  isOpen,
  onClose,
  onBillAnalyzed,
}) => {
  const [billTitle, setBillTitle] = useState('');
  const [billCode, setBillCode] = useState('Bill C-99');
  const [billText, setBillText] = useState('');
  const [citizenConcern, setCitizenConcern] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleLegislationDraft = `PART 1: AI TRANSPARENCY & AUDITING OBLIGATIONS
Section 4 (1) Every commercial developer or operator of an automated algorithmic decision system with more than 10,000 monthly active users in Canada shall maintain an auditable registry of training datasets and potential bias mitigation protocols.
(2) Where an algorithmic decision materially affects access to employment, credit, or housing, the operator must provide an unredacted plain-language summary to the affected individual within 14 business days upon request.
(3) Failure to comply constitutes an administrative violation punishable by fines of up to $1,000,000 or 2% of annual gross revenue.`;

  const handleUseSample = () => {
    setBillTitle('Algorithmic Decision Transparency and Consumer Safety Act');
    setBillCode('Bill C-99');
    setBillText(sampleLegislationDraft);
    setCitizenConcern('I am a job applicant concerned that automated AI filters reject resumes without explanation.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billText.trim()) {
      setError('Please provide legislative text or draft statutory clauses to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-custom-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: billTitle || 'Custom Legislation',
          text: billText,
          citizenConcern,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await response.json();

      // Convert into full Bill object
      const customBill: Bill = {
        id: `custom-${Date.now()}`,
        code: billCode || 'Custom Bill',
        title: billTitle || 'Proposed Legislative Act',
        popularName: billTitle || 'Custom Analyzed Legislation',
        parliamentSession: '44th Parliament (Custom Analysis)',
        sponsor: {
          name: 'Citizen Submission',
          title: 'Public Stakeholder',
          party: 'Non-Partisan',
        },
        summaryPlain: data.summaryPlain || 'Custom statutory analysis provided by Civic Lens pipeline.',
        summaryOfficial: billTitle,
        dateIntroduced: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        currentStage: 'Public Policy Formulation',
        overallProgress: 20,
        stages: [
          {
            stage: 'Policy Proposal & Drafting',
            chamber: 'House of Commons',
            status: 'completed',
            date: 'Current',
            description: 'Statutory clauses formulated and submitted for civic analysis.',
            canAmend: true,
          },
          {
            stage: 'First Reading & Debate',
            chamber: 'House of Commons',
            status: 'current',
            date: 'Pending',
            description: 'Introduction to Parliament for formal legislative review.',
            canAmend: true,
          },
        ],
        committee: {
          name: 'Standing Committee on Industry, Science and Technology',
          acronym: 'INDU',
          chamber: 'House of Commons',
          chair: 'Parliamentary Review Committee',
          currentActivity: 'Citizen-submitted legislative review',
          keyIssuesUnderStudy: [
            'Assessment of regulatory burden versus public consumer protection',
            'Enforcement powers and administrative fine structures',
          ],
        },
        keyPillars: data.keyPillars || [],
        personas: data.personas || [],
        unresolvedDebates: data.unresolvedDebates || [],
      };

      onBillAnalyzed(customBill);
      onClose();
    } catch (err: any) {
      setError('Could not analyze document. Please check the text format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white border border-stone-300 rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-200 bg-[#FBF9F5] flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-sans text-stone-500 font-medium">
              Document Intake & Legal Pipeline
            </div>
            <h3 className="text-lg font-serif font-semibold text-stone-900 mt-0.5">
              Analyze Any Bill, Policy Draft, or Regulation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs uppercase tracking-wider font-sans font-medium text-stone-700 mb-1">
                Bill / Document Ref
              </label>
              <input
                type="text"
                value={billCode}
                onChange={(e) => setBillCode(e.target.value)}
                placeholder="e.g. Bill C-99"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider font-sans font-medium text-stone-700 mb-1">
                Short Bill Title
              </label>
              <input
                type="text"
                value={billTitle}
                onChange={(e) => setBillTitle(e.target.value)}
                placeholder="e.g. AI Transparency Act"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs uppercase tracking-wider font-sans font-medium text-stone-700">
                Statutory Text or Policy Clauses
              </label>
              <button
                type="button"
                onClick={handleUseSample}
                className="text-xs text-amber-800 hover:text-amber-950 font-medium"
              >
                Insert Sample Draft
              </button>
            </div>
            <textarea
              rows={8}
              value={billText}
              onChange={(e) => setBillText(e.target.value)}
              placeholder="Paste clauses, statutory sections, or legislative text here..."
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-sans font-medium text-stone-700 mb-1">
              Your Specific Citizen Concern (Optional)
            </label>
            <input
              type="text"
              value={citizenConcern}
              onChange={(e) => setCitizenConcern(e.target.value)}
              placeholder="e.g. How does this affect my job application or small business?"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs"
            />
          </div>
        </form>

        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !billText.trim()}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Processing Statutory Graph...' : 'Analyze with Civic Lens'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
