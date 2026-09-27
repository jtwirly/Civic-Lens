import React from 'react';
import { Bill } from '../types/civic';
import { FileText, Users, Clock, Send, Landmark, ChevronRight, HelpCircle } from 'lucide-react';

interface CivicGraphProps {
  bill: Bill;
  onNavigateNode: (target: 'overview' | 'personas' | 'timeline' | 'action') => void;
  onInspectCitation: (citation: any) => void;
}

export const CivicGraph: React.FC<CivicGraphProps> = ({
  bill,
  onNavigateNode,
  onInspectCitation,
}) => {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-stone-100">
        <div>
          <div className="text-xs uppercase tracking-widest text-stone-500 font-sans">
            Parliamentary Entity Graph
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 mt-1">
            The Civic Lens Graph: From Statutory Text to Action
          </h2>
        </div>
        <div className="text-xs text-stone-500 font-sans">
          Click any node to inspect evidence or trigger civic action
        </div>
      </div>

      {/* Visual Interactive Graph Pipeline */}
      <div className="relative max-w-4xl mx-auto py-4">
        {/* Top Node: The Bill */}
        <div className="flex justify-center">
          <div className="bg-stone-900 text-white rounded-lg p-4 max-w-md w-full text-center shadow-md relative group cursor-pointer hover:bg-stone-800 transition-colors"
               onClick={() => onNavigateNode('overview')}>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-300">
              Parliamentary Bill
            </div>
            <div className="text-lg font-serif font-medium text-white mt-0.5">
              {bill.code}: {bill.popularName.split('(')[0]}
            </div>
            <div className="text-xs text-stone-300 mt-1">
              Sponsored by {bill.sponsor.name} ({bill.sponsor.party})
            </div>
          </div>
        </div>

        {/* Connector Spine Downward */}
        <div className="w-0.5 h-8 bg-stone-300 mx-auto"></div>

        {/* 3-Way Fork Line */}
        <div className="relative hidden md:block">
          <div className="h-0.5 bg-stone-300 max-w-2xl mx-auto"></div>
          <div className="flex justify-between max-w-2xl mx-auto">
            <div className="w-0.5 h-6 bg-stone-300"></div>
            <div className="w-0.5 h-6 bg-stone-300"></div>
            <div className="w-0.5 h-6 bg-stone-300"></div>
          </div>
        </div>

        {/* Tier 2: The Three Core Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
          {/* Node 1: What It Does */}
          <div 
            onClick={() => onNavigateNode('overview')}
            className="border border-stone-200 bg-[#FBF9F5] hover:border-amber-700/60 rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs font-sans text-stone-500 mb-2">
              <span className="uppercase tracking-wider font-medium text-stone-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-800" />
                What It Does
              </span>
              <span className="font-mono text-stone-400">{bill.keyPillars.length} Pillars</span>
            </div>
            <p className="text-xs text-stone-700 line-clamp-3 leading-relaxed">
              {bill.summaryPlain}
            </p>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-amber-900 font-medium group-hover:translate-x-0.5 transition-transform">
              <span>View Plain Law & Diffs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Node 2: Who It Affects */}
          <div 
            onClick={() => onNavigateNode('personas')}
            className="border border-stone-200 bg-[#FBF9F5] hover:border-amber-700/60 rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs font-sans text-stone-500 mb-2">
              <span className="uppercase tracking-wider font-medium text-stone-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-800" />
                Who It Affects
              </span>
              <span className="font-mono text-stone-400">{bill.personas.length} Personas</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {bill.personas.slice(0, 3).map((p) => (
                <span key={p.id} className="text-xs text-stone-700 bg-stone-200/60 px-1.5 py-0.5 rounded">
                  {p.name.split('/')[0]}
                </span>
              ))}
            </div>
            <p className="text-xs text-stone-600 line-clamp-2">
              Identifies rights, liabilities, and required compliance steps.
            </p>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-amber-900 font-medium group-hover:translate-x-0.5 transition-transform">
              <span>Inspect Persona Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Node 3: Where It Is Now */}
          <div 
            onClick={() => onNavigateNode('timeline')}
            className="border border-stone-200 bg-[#FBF9F5] hover:border-amber-700/60 rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs font-sans text-stone-500 mb-2">
              <span className="uppercase tracking-wider font-medium text-stone-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                Where It Is Now
              </span>
              <span className="text-amber-800 font-semibold">{bill.overallProgress}%</span>
            </div>
            <div className="text-sm font-serif font-medium text-stone-900 mb-1">
              {bill.currentStage}
            </div>
            <p className="text-xs text-stone-600 line-clamp-2">
              Before {bill.committee.name} ({bill.committee.acronym}). Active opportunity for amendment.
            </p>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-amber-900 font-medium group-hover:translate-x-0.5 transition-transform">
              <span>See Legislative Stages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Convergence Connector Downward */}
        <div className="relative hidden md:block">
          <div className="flex justify-between max-w-2xl mx-auto">
            <div className="w-0.5 h-6 bg-stone-300"></div>
            <div className="w-0.5 h-6 bg-stone-300"></div>
            <div className="w-0.5 h-6 bg-stone-300"></div>
          </div>
          <div className="h-0.5 bg-stone-300 max-w-2xl mx-auto"></div>
        </div>
        <div className="w-0.5 h-8 bg-stone-300 mx-auto"></div>

        {/* Tier 3: Core Hub: What You Can Do */}
        <div className="flex justify-center my-2">
          <div 
            onClick={() => onNavigateNode('action')}
            className="bg-amber-900 text-white rounded-lg p-4 max-w-md w-full text-center shadow-md cursor-pointer hover:bg-amber-950 transition-colors"
          >
            <div className="text-xs font-sans uppercase tracking-widest text-amber-200">
              The People ➔ Government Bridge
            </div>
            <div className="text-lg font-serif font-medium text-white mt-0.5">
              What You Can Do Right Now
            </div>
            <div className="text-xs text-amber-100 mt-1">
              Convert personal understanding into impact
            </div>
          </div>
        </div>

        {/* Bottom 3 Action Channels */}
        <div className="w-0.5 h-6 bg-stone-300 mx-auto"></div>
        <div className="relative hidden md:block">
          <div className="h-0.5 bg-stone-300 max-w-xl mx-auto"></div>
          <div className="flex justify-between max-w-xl mx-auto">
            <div className="w-0.5 h-6 bg-stone-300"></div>
            <div className="w-0.5 h-6 bg-stone-300"></div>
            <div className="w-0.5 h-6 bg-stone-300"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto mt-2 text-center">
          <button
            onClick={() => onNavigateNode('action')}
            className="p-3 border border-stone-200 bg-white hover:bg-stone-50 rounded-md transition-colors text-left"
          >
            <div className="text-xs font-medium text-stone-900">1. Contact Your MP</div>
            <div className="text-xs text-stone-500 mt-0.5">Postal code matched letter with exact statutory clauses</div>
          </button>

          <button
            onClick={() => onNavigateNode('action')}
            className="p-3 border border-stone-200 bg-white hover:bg-stone-50 rounded-md transition-colors text-left"
          >
            <div className="text-xs font-medium text-stone-900">2. Submit to Committee</div>
            <div className="text-xs text-stone-500 mt-0.5">Formal brief for {bill.committee.acronym} hearings</div>
          </button>

          <button
            onClick={() => onNavigateNode('action')}
            className="p-3 border border-stone-200 bg-white hover:bg-stone-50 rounded-md transition-colors text-left"
          >
            <div className="text-xs font-medium text-stone-900">3. Track Next Reading</div>
            <div className="text-xs text-stone-500 mt-0.5">Alerts before third reading and transfer to Senate</div>
          </button>
        </div>
      </div>
    </div>
  );
};
