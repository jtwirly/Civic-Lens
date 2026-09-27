import React, { useState, useRef } from 'react';
import { SAMPLE_BILLS } from './data/bills';
import { Bill, Citation } from './types/civic';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { BillSearchDiscovery } from './components/BillSearchDiscovery';
import { CivicGraph } from './components/CivicGraph';
import { BillDetailView } from './components/BillDetailView';
import { CitizenTracer } from './components/CitizenTracer';
import { ActionEngine } from './components/ActionEngine';
import { CitationDrawer } from './components/CitationDrawer';
import { CustomBillModal } from './components/CustomBillModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { A2AJLegalExplorer } from './components/A2AJLegalExplorer';
import { FileText, Network, Users, Crosshair, Send, Scale } from 'lucide-react';

export default function App() {
  const [bills, setBills] = useState<Bill[]>(SAMPLE_BILLS);
  const [selectedBill, setSelectedBill] = useState<Bill>(SAMPLE_BILLS[0]);
  const [activeTab, setActiveTab] = useState<string>('graph');

  // Modals & Drawers
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Cross-component state passed to ActionEngine
  const [actionPersona, setActionPersona] = useState<string>('Small Business Founder');
  const [actionConcern, setActionConcern] = useState<string>('');
  const [actionClauses, setActionClauses] = useState<string[]>([]);

  const searchSectionRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);

  const handleInspectCitation = (citation: Citation) => {
    setActiveCitation(citation);
  };

  const handleSelectPersonaForAction = (personaName: string, concernSnippet: string) => {
    setActionPersona(personaName);
    setActionConcern(concernSnippet);
    setActiveTab('action');
    contentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTracerSendToAction = (persona: string, concern: string, clauses: string[]) => {
    setActionPersona(persona);
    setActionConcern(concern);
    setActionClauses(clauses);
    setActiveTab('action');
    contentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddCustomBill = (newBill: Bill) => {
    setBills((prev) => [newBill, ...prev]);
    setSelectedBill(newBill);
    setActiveTab('overview');
    contentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGraphNavigate = (target: 'overview' | 'personas' | 'timeline' | 'action') => {
    if (target === 'personas') {
      setActiveTab('personas');
    } else if (target === 'action') {
      setActiveTab('action');
    } else {
      setActiveTab('overview');
    }
    contentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col font-sans">
      {/* Top Header (Clean Wordmark only) */}
      <Header
        onHomeClick={() => {
          setActiveTab('graph');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Institutional Hero Marquee (Simplified, No Stats) */}
      <HeroBanner
        selectedBill={selectedBill}
        onExploreBill={() => {
          contentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* Bill Search & Discovery Console (OpenParliament Search & Presets) */}
      <div ref={searchSectionRef}>
        <BillSearchDiscovery
          bills={bills}
          selectedBill={selectedBill}
          onSelectBill={(b) => {
            setSelectedBill(b);
            if (!bills.some((existing) => existing.id === b.id)) {
              setBills((prev) => [b, ...prev]);
            }
          }}
          onOpenCustomBill={() => setIsCustomModalOpen(true)}
          onSelectPersonaForAction={handleSelectPersonaForAction}
        />
      </div>

      {/* Lower Section: Core Civic Modules */}
      <main ref={contentSectionRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Module Navigation Ribbon: Civic Graph FIRST, then Bill Overview */}
        <div className="bg-white border border-stone-200 rounded-lg p-2 shadow-xs flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'graph'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Civic Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bill Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('personas')}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'personas'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Who It Affects</span>
            </button>

            <button
              onClick={() => setActiveTab('tracer')}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'tracer'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Impact Tracer</span>
            </button>

            <button
              onClick={() => setActiveTab('action')}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'action'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Action Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('jurisprudence')}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'jurisprudence'
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Existing Law</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-stone-500 font-mono pr-2">
            <span>Analyzing:</span>
            <strong className="text-stone-900 font-semibold">{selectedBill.code}</strong>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'graph' && (
          <div className="space-y-6">
            <CivicGraph
              bill={selectedBill}
              onNavigateNode={handleGraphNavigate}
              onInspectCitation={handleInspectCitation}
            />
          </div>
        )}

        {activeTab === 'overview' && (
          <BillDetailView
            bill={selectedBill}
            onInspectCitation={handleInspectCitation}
            onSelectPersonaForAction={handleSelectPersonaForAction}
            defaultSubTab="pillars"
          />
        )}

        {activeTab === 'personas' && (
          <BillDetailView
            bill={selectedBill}
            onInspectCitation={handleInspectCitation}
            onSelectPersonaForAction={handleSelectPersonaForAction}
            defaultSubTab="personas"
          />
        )}

        {activeTab === 'tracer' && (
          <CitizenTracer
            bill={selectedBill}
            onInspectCitation={handleInspectCitation}
            onSendToAction={handleTracerSendToAction}
          />
        )}

        {activeTab === 'action' && (
          <ActionEngine
            bill={selectedBill}
            initialPersona={actionPersona}
            initialConcern={actionConcern}
            initialClauses={actionClauses}
          />
        )}

        {activeTab === 'jurisprudence' && (
          <A2AJLegalExplorer bill={selectedBill} />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-[#F7F4EE] text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-200/80">
            <div className="space-y-2 md:col-span-2">
              <div className="text-base font-serif font-semibold text-stone-900 flex items-center gap-2">
                <span className="text-amber-800 italic">Civic</span>
                <span>Lens</span>
              </div>
              <p className="text-stone-600 leading-relaxed max-w-md">
                An open civic technology project integrating live parliamentary data from <a href="https://openparliament.ca" target="_blank" rel="noreferrer" className="underline hover:text-stone-900">openparliament.ca</a> and Canadian case law from <a href="https://a2aj.ca" target="_blank" rel="noreferrer" className="underline hover:text-stone-900">A2AJ (Access to Algorithmic Justice)</a>. Bringing government closer to citizens through source-grounded legislative transparency.
              </p>
            </div>

            <div>
              <div className="font-sans font-medium uppercase tracking-wider text-stone-900 text-[11px] mb-2">
                Parliamentary & Legal Sources
              </div>
              <ul className="space-y-1.5">
                <li><a href="https://api.openparliament.ca" target="_blank" rel="noreferrer" className="hover:text-stone-950 transition-colors">OpenParliament API</a></li>
                <li><a href="https://api.a2aj.ca" target="_blank" rel="noreferrer" className="hover:text-stone-950 transition-colors">A2AJ Legal Data API (SCC & Statutes)</a></li>
                <li><a href="https://www.parl.ca/legisinfo" target="_blank" rel="noreferrer" className="hover:text-stone-950 transition-colors">LEGISinfo (parl.ca)</a></li>
                <li><a href="https://laws-lois.justice.gc.ca" target="_blank" rel="noreferrer" className="hover:text-stone-950 transition-colors">Justice Laws Canada</a></li>
              </ul>
            </div>

            <div>
              <div className="font-sans font-medium uppercase tracking-wider text-stone-900 text-[11px] mb-2">
                Civic Verification
              </div>
              <ul className="space-y-1.5">
                <li><button onClick={() => setIsArchitectureModalOpen(true)} className="hover:text-stone-950 transition-colors text-left">Technical Architecture & Grounding Proof</button></li>
                <li><button onClick={() => setIsCustomModalOpen(true)} className="hover:text-stone-950 transition-colors text-left">Ingest Custom Bill</button></li>
                <li><button onClick={handleScrollToSearch} className="hover:text-stone-950 transition-colors text-left">Search Live Parliamentary Bills</button></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-stone-500">
            <div>
              Contains information licensed under the Open Government Licence – Canada and A2AJ Open Legal Data.
            </div>
            <div className="font-mono text-[11px]">
              Civic Lens · 45th & 44th Canadian Parliament
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-in Verified Statutory Citation Drawer */}
      <CitationDrawer
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* Custom Bill Analysis Modal */}
      <CustomBillModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onBillAnalyzed={handleAddCustomBill}
      />

      {/* Technical Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}
