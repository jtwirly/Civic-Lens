export interface Citation {
  section: string;
  actName: string;
  shortExcerpt: string;
  fullClauseText: string;
  legalContext: string;
}

export interface KeyPillar {
  id: string;
  title: string;
  plainLanguage: string;
  beforeAfter: {
    before: string;
    after: string;
  };
  affectedGroups: string[];
  citation: Citation;
}

export interface PersonaImpact {
  id: string;
  name: string;
  category: string;
  impactLevel: 'High' | 'Moderate' | 'Targeted';
  impactType: 'Compliance Obligation' | 'New Rights & Protections' | 'Economic Impact' | 'Procedural Change';
  summary: string;
  keyProvisions: string[];
  citationRef: string;
  suggestedAction: string;
}

export interface LegislativeStage {
  stage: string;
  chamber: 'House of Commons' | 'Senate' | 'Governor General';
  status: 'completed' | 'current' | 'upcoming';
  date: string;
  description: string;
  canAmend: boolean;
}

export interface ParliamentaryCommittee {
  name: string;
  acronym: string;
  chamber: string;
  chair: string;
  currentActivity: string;
  submissionDeadline?: string;
  parlvuUrl?: string;
  keyIssuesUnderStudy: string[];
}

export interface Bill {
  id: string;
  code: string;
  title: string;
  popularName: string;
  parliamentSession: string;
  sponsor: {
    name: string;
    title: string;
    party: string;
  };
  summaryPlain: string;
  summaryOfficial: string;
  dateIntroduced: string;
  currentStage: string;
  overallProgress: number; // 0 - 100 percentage
  stages: LegislativeStage[];
  committee: ParliamentaryCommittee;
  keyPillars: KeyPillar[];
  personas: PersonaImpact[];
  unresolvedDebates: {
    question: string;
    perspectiveFor: string;
    perspectiveAgainst: string;
    sourceCommittee: string;
  }[];
}

export interface Representative {
  id: string;
  name: string;
  riding: string;
  province: string;
  party: string;
  email: string;
  phone: string;
  postalCodePrefixes: string[];
  hillOffice: string;
  ridingOffice: string;
  photoUrl?: string;
  parliamentaryRoles: string[];
}

export interface GeneratedActionLetter {
  recipientType: 'mp' | 'senator' | 'committee';
  recipientName: string;
  subject: string;
  body: string;
  wordCount: number;
  statutoryCitations: string[];
  suggestedSubjectLines: string[];
  submissionTips: string[];
}
