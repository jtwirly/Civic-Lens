import React, { useState, useEffect } from 'react';
import { Bill, Representative } from '../types/civic';
import { CANADIAN_REPRESENTATIVES, findRepresentativeByPostalCode } from '../data/representatives';
import { Send, Mail, Phone, MapPin, Copy, Check, Printer, Sparkles, Building2, HelpCircle, FileCheck } from 'lucide-react';

interface ActionEngineProps {
  bill: Bill;
  initialPersona?: string;
  initialConcern?: string;
  initialClauses?: string[];
}

export const ActionEngine: React.FC<ActionEngineProps> = ({
  bill,
  initialPersona = 'Concerned Constituent',
  initialConcern = '',
  initialClauses = [],
}) => {
  const [postalCode, setPostalCode] = useState('K1A 0A6');
  const [selectedRep, setSelectedRep] = useState<Representative>(CANADIAN_REPRESENTATIVES[0]);
  const [persona, setPersona] = useState(initialPersona);
  const [userConcern, setUserConcern] = useState(
    initialConcern || `I am concerned about how ${bill.code} balances innovation with compliance costs for local organizations, particularly under the proposed regulatory powers.`
  );
  const [targetType, setTargetType] = useState<'mp' | 'committee'>('mp');
  const [tone, setTone] = useState<'constructive' | 'concise' | 'technical'>('constructive');
  const [wordCountTarget, setWordCountTarget] = useState<150 | 300>(150);
  const [letterBody, setLetterBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync state if props change
  useEffect(() => {
    if (initialPersona) setPersona(initialPersona);
    if (initialConcern) setUserConcern(initialConcern);
  }, [initialPersona, initialConcern]);

  // Handle postal code search
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setPostalCode(val);
    const matched = findRepresentativeByPostalCode(val);
    if (matched) {
      setSelectedRep(matched);
    }
  };

  // Generate Letter Text based on parameters
  const generateLetter = () => {
    setIsGenerating(true);

    const is150 = wordCountTarget === 150;
    const isTech = tone === 'technical';
    const isCommittee = targetType === 'committee';

    setTimeout(() => {
      let subject = '';
      let body = '';

      if (isCommittee) {
        subject = `Brief to the ${bill.committee.acronym} Committee: Proposed Amendments to ${bill.code}`;
        body = `TO: The Clerk of the Standing Committee on Industry and Technology (INDU)
REGARDING: Study of ${bill.code} (${bill.popularName})
FROM: [Your Name / Organization Name], [City, Province]
DATE: September 2026

EXECUTIVE SUMMARY:
This submission provides constituent feedback regarding ${bill.code}. As a ${persona}, I support modernizing statutory protections for Canadians. However, certain provisions require technical adjustments during committee clause-by-clause consideration to ensure operational feasibility.

SPECIFIC STATUTORY CONCERNS:
1. Regulatory Thresholds: Provisions governing automated systems should establish objective, predictable criteria rather than delegating foundational definitions entirely to future regulations.
2. Proportional Compliance: Small organizations and innovators require clear safe-harbours and graduated compliance timelines to avoid unintended market concentration.
3. Procedural Protections: Ensure independent review mechanisms before administrative penalties are finalized.

RECOMMENDED ACTION FOR THE COMMITTEE:
Adopt an amendment to ensure small enterprises and open researchers are protected by clear statutory guidance before the bill is reported back to the House of Commons.

Respectfully submitted,
[Your Name / Title]
[Your Contact Information]`;
      } else {
        subject = `Constituent Input on ${bill.code}: ${bill.popularName.split('(')[0].trim()}`;
        if (is150) {
          body = `Dear ${selectedRep.name},

I am writing to you as a constituent residing in ${selectedRep.riding} to share my views on ${bill.code} (${bill.popularName.split('(')[0].trim()}).

As a ${persona}, I am following this legislation closely. Specifically, ${userConcern}

While I believe modernizing this statute is important, I respectfully ask that you represent our community’s interests by supporting key amendments during committee consideration:
1. Clarify definitions to ensure ordinary citizens and small innovators are not burdened with disproportionate compliance requirements;
2. Ensure adequate transition periods before enforcement begins; and
3. Protect procedural fairness in administrative orders.

Thank you for your dedicated representation of ${selectedRep.riding} in the House of Commons. I look forward to your reply.

Yours sincerely,
[Your Full Name]
[Your Street Address, City, Postal Code]
[Your Phone Number]`;
        } else {
          body = `Dear ${selectedRep.name},

I am writing to you today as your constituent in ${selectedRep.riding} to present recommendations regarding ${bill.code}, the ${bill.title}.

As a ${persona}, I appreciate the federal government's efforts to update our national frameworks. However, having examined the bill's provisions and committee hearings, I am concerned about:
${userConcern}

Our community relies on practical, balanced laws that foster innovation while maintaining strong civil protections. Specifically, I urge you to work with your parliamentary colleagues on the following priorities:

First, ensure that statutory thresholds are grounded in clear legislative standards rather than left entirely to unscrutinized regulations.
Second, advocate for a graduated compliance runway for small community organizations, startups, and public bodies that lack corporate compliance teams.
Third, guarantee robust due process and transparent appeal channels for any administrative measures.

As this bill proceeds through committee and report stage, your leadership can make a meaningful difference for our riding. Thank you for your continued public service, and I would welcome the opportunity to discuss this further with your constituency office.

With warm regards,
[Your Full Name]
[Your Street Address & Postal Code]
[Your Email & Phone]`;
        }
      }

      setLetterBody(body);
      setIsGenerating(false);
    }, 250);
  };

  useEffect(() => {
    generateLetter();
  }, [selectedRep, persona, userConcern, targetType, tone, wordCountTarget, bill]);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailTo = () => {
    const subject = encodeURIComponent(`Constituent Input on ${bill.code} - ${bill.popularName.split('(')[0]}`);
    const body = encodeURIComponent(letterBody);
    const recipient = targetType === 'committee' ? 'indu@parl.gc.ca' : selectedRep.email;
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  const wordCount = letterBody.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 lg:p-8 shadow-sm space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900">
            Turn Understanding Into Impact
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Representative & Settings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-sans font-medium text-stone-700 mb-2">
              Action Recipient
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-lg">
              <button
                type="button"
                onClick={() => setTargetType('mp')}
                className={`py-2 text-xs font-medium rounded-md transition-colors ${
                  targetType === 'mp' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600'
                }`}
              >
                My Member of Parliament
              </button>
              <button
                type="button"
                onClick={() => setTargetType('committee')}
                className={`py-2 text-xs font-medium rounded-md transition-colors ${
                  targetType === 'committee' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600'
                }`}
              >
                {bill.committee.acronym} Committee Brief
              </button>
            </div>
          </div>

          {/* Postal Code MP Matcher */}
          {targetType === 'mp' && (
            <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-lg space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider font-sans font-medium text-stone-700 mb-1">
                  Find Your MP by Postal Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    maxLength={7}
                    placeholder="e.g. K1A 0A6 or M5V 2T6"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs font-mono uppercase focus:ring-1 focus:ring-amber-700 focus:outline-none"
                  />
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  Try sample Canadian codes: <code className="bg-stone-200/60 px-1 rounded">K1A 0A6</code> (Ottawa), <code className="bg-stone-200/60 px-1 rounded">M5V 2T6</code> (Toronto), <code className="bg-stone-200/60 px-1 rounded">T2P 1J9</code> (Calgary), <code className="bg-stone-200/60 px-1 rounded">G1W 1R9</code> (Quebec)
                </div>
              </div>

              {/* Matched MP Card */}
              <div className="pt-3 border-t border-stone-200/70 space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-serif font-semibold text-stone-900 text-sm">{selectedRep.name}</div>
                    <div className="text-stone-600 font-sans">{selectedRep.riding}, {selectedRep.province}</div>
                  </div>
                  <span className="text-[11px] font-medium text-stone-700 bg-white border border-stone-200 px-2 py-0.5 rounded">
                    {selectedRep.party}
                  </span>
                </div>

                <div className="space-y-1 text-stone-600 pt-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-mono">{selectedRep.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{selectedRep.phone} (Parliament Hill)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{selectedRep.hillOffice}</span>
                  </div>
                </div>

                {selectedRep.parliamentaryRoles.length > 0 && (
                  <div className="pt-2 border-t border-stone-200/50">
                    <div className="text-[11px] text-amber-900 font-medium">
                      Parliamentary Assignment: {selectedRep.parliamentaryRoles[0]}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Committee Details if Committee Selected */}
          {targetType === 'committee' && (
            <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-lg text-xs space-y-2">
              <div className="font-serif font-semibold text-stone-900 text-sm">
                {bill.committee.name}
              </div>
              <p className="text-stone-600 leading-relaxed">
                Committee Chair: <strong className="text-stone-900">{bill.committee.chair}</strong>
              </p>
              <p className="text-stone-600">
                Official briefs submitted in electronic format are distributed to all 12 Members of Parliament on the committee and published in the official Hansard evidence.
              </p>
            </div>
          )}

          {/* Persona & Tone Controls */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans font-medium text-stone-700 mb-1">
                Your Persona
              </label>
              <input
                type="text"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="e.g. Small Business Owner, Parent, Engineer"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-amber-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-sans font-medium text-stone-700 mb-1">
                Your Specific Concern / Recommendation
              </label>
              <textarea
                rows={3}
                value={userConcern}
                onChange={(e) => setUserConcern(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-amber-700 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-stone-500">Length:</span>
                <button
                  type="button"
                  onClick={() => setWordCountTarget(150)}
                  className={`px-2 py-0.5 rounded text-xs ${wordCountTarget === 150 ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'}`}
                >
                  150 words
                </button>
                <button
                  type="button"
                  onClick={() => setWordCountTarget(300)}
                  className={`px-2 py-0.5 rounded text-xs ${wordCountTarget === 300 ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'}`}
                >
                  300 words
                </button>
              </div>

              <button
                type="button"
                onClick={generateLetter}
                className="text-xs text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Regenerate Draft</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: The Generated Letter & Dispatch Tools */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-sans font-medium text-stone-700">
                Official Parliamentary Draft
              </span>
              <span className="text-xs font-mono text-stone-500 tabular-nums">
                ({wordCount} words)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-medium text-stone-800 hover:text-stone-950 border border-stone-300 rounded bg-white hover:bg-stone-50 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Letter Text'}</span>
              </button>
            </div>
          </div>

          {/* Letter Paper Box */}
          <div className="bg-[#FAF8F5] border border-stone-300 rounded-lg p-6 shadow-xs font-serif text-sm text-stone-900 leading-relaxed relative">
            <div className="text-xs font-sans text-stone-500 uppercase tracking-widest pb-3 mb-4 border-b border-stone-200 flex items-center justify-between">
              <span>Parliamentary Correspondence</span>
              <span>{bill.code} Study</span>
            </div>

            <textarea
              value={letterBody}
              onChange={(e) => setLetterBody(e.target.value)}
              rows={16}
              className="w-full bg-transparent border-0 p-0 text-sm font-serif text-stone-900 leading-relaxed focus:outline-none focus:ring-0 resize-y"
            />
          </div>

          {/* Crucial Civic Education: Postage-Free Parliament Mail Rule */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600 leading-relaxed flex items-start gap-2.5">
            <FileCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-800 font-semibold">Did you know?</strong> Under the <em>Canada Post Corporation Act</em> (Section 35), any mail sent to a Member of Parliament at the House of Commons in Ottawa does <strong>not</strong> require postage stamps. You can print this letter and drop it in any Canada Post mailbox for free!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
