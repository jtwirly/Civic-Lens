import React, { useState } from 'react';
import { Bill, Citation } from '../types/civic';
import { FileText, ArrowRight, Shield, CheckCircle2, AlertTriangle, Scale, ExternalLink, HelpCircle, Landmark } from 'lucide-react';
import { A2AJLegalExplorer } from './A2AJLegalExplorer';
import { OpenParliamentDebates } from './OpenParliamentDebates';

interface BillDetailViewProps {
  bill: Bill;
  onInspectCitation: (citation: Citation) => void;
  onSelectPersonaForAction: (personaName: string, concernSnippet: string) => void;
  defaultSubTab?: 'pillars' | 'personas' | 'timeline' | 'jurisprudence' | 'hansard';
}

export const BillDetailView: React.FC<BillDetailViewProps> = ({
  bill,
  onInspectCitation,
  onSelectPersonaForAction,
  defaultSubTab = 'pillars',
}) => {
  return (
    <div className="space-y-8">
      {/* Subtab 1: Pillars & Before-After Comparison */}
      {defaultSubTab === 'pillars' && (
        <div className="space-y-8">
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900">
                  Substantive Legal Changes
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  How {bill.code} amends existing Canadian statutory rights and obligations
                </p>
              </div>
              <span className="text-xs font-mono text-stone-500 self-start sm:self-auto bg-stone-50 border border-stone-200 px-2.5 py-1 rounded">
                {bill.keyPillars.length} Core Pillars
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {bill.keyPillars.map((pillar, idx) => (
                <div
                  key={pillar.id}
                  className="bg-[#FAF8F5] border border-stone-200/90 rounded-lg p-5 shadow-2xs hover:border-stone-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-800 font-bold">0{idx + 1}.</span>
                      <span>{pillar.title}</span>
                    </h3>
                    
                    {/* Verified Statutory Citation Badge Button */}
                    <button
                      onClick={() => onInspectCitation(pillar.citation)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded text-xs font-mono transition-colors self-start"
                      title="Inspect verbatim statutory clause"
                    >
                      <Shield className="w-3 h-3 text-amber-700" />
                      <span>[§ {pillar.citation.section}]</span>
                    </button>
                  </div>

                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4">
                    {pillar.plainLanguage}
                  </p>

                  {/* Before vs After Legal Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-white border border-stone-200 rounded-md text-xs">
                    <div>
                      <div className="font-sans font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span>Before this Bill (Current Law)</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {pillar.beforeAfter.before}
                      </p>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-stone-200 pt-3 md:pt-0 md:pl-3">
                      <div className="font-sans font-semibold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span>After Enactment (New Rule)</span>
                      </div>
                      <p className="text-stone-800 leading-relaxed font-medium">
                        {pillar.beforeAfter.after}
                      </p>
                    </div>
                  </div>

                  {/* Affected Stakeholder Tags & Quick Action */}
                  <div className="mt-3 pt-3 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <span className="font-medium">Impacts:</span>
                      {pillar.affectedGroups.map((group, gIdx) => (
                        <span key={group} className="text-stone-700 font-medium">
                          {group}{gIdx < pillar.affectedGroups.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onSelectPersonaForAction(pillar.affectedGroups[0] || 'Citizen', `Concerned about ${pillar.title}`)}
                      className="text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 group"
                    >
                      <span>Draft Rep Letter on this Issue</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legislative Stage & Active Committee */}
          <div className="space-y-4 pt-2">
            <div className="pb-3 border-b border-stone-200">
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900">
                Stage
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Current legislative progression, amendment windows, and committee study
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Chronological Legislative Journey (FIRST) */}
              <div className="lg:col-span-7 bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
                <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
                  <h3 className="text-base font-serif font-semibold text-stone-900">
                    Parliamentary Journey
                  </h3>
                  <span className="text-xs font-mono text-stone-500">
                    Current: <strong className="text-amber-800 font-semibold">{bill.currentStage}</strong>
                  </span>
                </div>

                <div className="relative border-l-2 border-stone-200 ml-3 space-y-5 pl-5 my-2">
                  {bill.stages.map((stage, sIdx) => {
                    const isCompleted = stage.status === 'completed';
                    const isCurrent = stage.status === 'current';

                    return (
                      <div key={sIdx} className="relative">
                        {/* Stage Marker Dot */}
                        <div
                          className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                            isCompleted
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : isCurrent
                              ? 'border-amber-700 bg-amber-100 ring-3 ring-amber-100'
                              : 'border-stone-300'
                          }`}
                        >
                          {isCompleted && <div className="w-1 h-1 bg-white rounded-full"></div>}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <div className="text-sm font-serif font-semibold text-stone-900">
                            {stage.stage}
                            {isCurrent && (
                              <span className="ml-2 text-[10px] font-sans font-medium text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                Current Stage
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-stone-500 font-mono">{stage.date}</span>
                        </div>

                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {stage.description}
                        </p>

                        {stage.canAmend && isCurrent && (
                          <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Window to Propose Amendments is Open: Citizens and groups can submit briefs to MPs now.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Committee Spotlight (SECOND) */}
              <div className="lg:col-span-5 bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
                <div className="pb-3 border-b border-stone-100">
                  <div className="text-xs uppercase tracking-wider font-sans text-stone-500 font-medium">
                    Active Parliamentary Committee
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-stone-900 mt-0.5">
                    {bill.committee.name} ({bill.committee.acronym})
                  </h3>
                  <div className="text-xs text-stone-500 mt-1">
                    Committee Chair: <strong className="text-stone-800">{bill.committee.chair}</strong>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <strong className="text-stone-900 font-medium">Current Activity:</strong> {bill.committee.currentActivity}
                </p>

                <div className="bg-[#FAF8F5] border border-stone-200 rounded p-3.5 text-xs space-y-2">
                  <div className="font-medium text-stone-800">Key Issues Under Committee Study:</div>
                  <ul className="space-y-1.5 text-stone-700">
                    {bill.committee.keyIssuesUnderStudy.map((issue) => (
                      <li key={issue} className="flex items-start gap-1.5">
                        <span className="text-amber-800 font-bold mt-0.5">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {bill.committee.parlvuUrl && (
                  <div className="pt-2">
                    <a
                      href={bill.committee.parlvuUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-950 font-medium"
                    >
                      <span>Watch Recorded Committee Meetings on ParlVU</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Unresolved Debates Box (Moved to Bill Overview) */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Scale className="w-4 h-4 text-amber-800" />
              <h3 className="text-base font-serif font-semibold text-stone-900">
                Unresolved Parliamentary Debates & Policy Trade-Offs
              </h3>
            </div>
            <div className="space-y-4">
              {bill.unresolvedDebates.map((debate, dIdx) => (
                <div key={dIdx} className="bg-[#FAF8F5] border border-stone-200 rounded p-4 text-xs space-y-2">
                  <div className="font-serif text-sm font-semibold text-stone-900">
                    "{debate.question}"
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-stone-700">
                    <div className="bg-white p-3 rounded border border-stone-200">
                      <div className="font-medium text-emerald-800 mb-1">Perspective in Support:</div>
                      <p className="leading-relaxed">{debate.perspectiveFor}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-stone-200">
                      <div className="font-medium text-amber-800 mb-1">Counter-Perspective / Concern:</div>
                      <p className="leading-relaxed">{debate.perspectiveAgainst}</p>
                    </div>
                  </div>
                  <div className="text-stone-400 font-mono text-[11px] pt-1">
                    Source: {debate.sourceCommittee}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Persona Impact Matrix */}
      {defaultSubTab === 'personas' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900">
                  Who It Affects
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Specific rights, obligations, and compliance implications mapped by citizen & business persona
                </p>
              </div>
              <span className="text-xs font-mono text-stone-500 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded">
                {bill.personas.length} Persona Assessments
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bill.personas.map((persona) => (
                <div
                  key={persona.id}
                  className="bg-[#FAF8F5] border border-stone-200 rounded-lg p-5 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="text-xs uppercase tracking-wider font-sans text-stone-400">
                          {persona.category}
                        </div>
                        <h3 className="text-base font-serif font-semibold text-stone-900 mt-0.5">
                          {persona.name}
                        </h3>
                      </div>
                      <span className="text-xs font-medium text-stone-700 bg-white border border-stone-200 px-2 py-0.5 rounded">
                        {persona.impactType}
                      </span>
                    </div>

                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4">
                      {persona.summary}
                    </p>

                    <div className="space-y-2 mb-4 text-xs">
                      <div className="text-stone-500 uppercase tracking-wider font-sans font-medium">Key Provisions:</div>
                      <ul className="space-y-1">
                        {persona.keyProvisions.map((prov) => (
                          <li key={prov} className="text-stone-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                            <span>{prov}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs text-stone-500">Suggested Action</span>
                    <button
                      onClick={() => onSelectPersonaForAction(persona.name, persona.summary)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <span>Take Action as {persona.name.split('/')[0]}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
