export interface CaseReference {
  id: string;
  title: string;
  year: number;
  relevance: string;
}

export interface Authority {
  name: string;
  type: string;
  reason: string;
  maps: string;
}

export interface LocationGuidance {
  issue_type: string;
  primary_authorities: Authority[];
  secondary_authorities: Authority[];
  helpline: string;
  online_option: string;
  required_documents: string[];
  what_to_say: string;
  urgency: string;
  next_step: string;
}

export interface LegalResponse {
  issue: string;
  law: string;
  reason: string;
  summary: string;
  detailed_analysis: string;
  strength: number; 
  steps: {
    step_number: number;
    title: string;
    description: string;
    action_required: string;
  }[];
  next_steps: string[];
  cases: CaseReference[];
  location_guidance?: LocationGuidance;
}

export interface Case {
  id: string;
  title: string;
  issueType?: string;
  status: 'Action pending' | 'Filed' | 'Resolved';
  strength: number;
  law?: string;
  description?: string;
  lastUpdated: string;
}

export interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  available: boolean;
  distance?: string;
}

export interface DocumentResult {
  id: string;
  title: string;
  content: string;
  type: 'FIR' | 'Complaint' | 'Notice';
}

export interface UploadResult {
  filename: string;
  size: number;
  secured: boolean;
  timestamp: string;
}

export const mockLegalResponse: LegalResponse = {
  issue: "Consumer Rights Violation / Deficient Service",
  law: "Section 35, Consumer Protection Act, 2019",
  reason: "The service provider failed to deliver the promised services after receiving payment, which constitutes a deficiency in service under the CPA 2019.",
  steps: [
    "Send a formal Legal Notice to the service provider giving them 15 days to resolve the issue.",
    "If unresolved, file a formal complaint online at the National Consumer Helpline (NCH) portal.",
    "Draft a formal complaint for the District Consumer Disputes Redressal Commission if NCH yields no result."
  ],
  next_steps: [
    "Generate Legal Notice",
    "Contact Lawyer",
    "View E-Daakhil Portal"
  ],
  cases: [
    {
      id: "c1",
      title: "Pawan Kumar vs. MakeMyTrip",
      year: 2021,
      relevance: "Established liability of platforms for deficient service by third-party vendors."
    },
    {
      id: "c2",
      title: "Vasantrao vs. Airtel",
      year: 2019,
      relevance: "Held that unexplained service disruptions warrant compensation."
    }
  ],
  summary: "You have a strong case for deficient service. The first immediate step is sending a formal legal notice to establish a paper trail.",
  strength: 82,
};

export const mockCases: Case[] = [
  {
    id: "case_101",
    issueType: "E-Commerce Fraud",
    status: "Action pending",
    strength: 82,
    lastUpdated: "2026-04-18"
  },
  {
    id: "case_102",
    issueType: "Tenant Dispute",
    status: "Filed",
    strength: 95,
    lastUpdated: "2026-04-05"
  }
];

export const mockLawyers: Lawyer[] = [
  {
    id: "l1",
    name: "Adv. Sanjay Verma",
    specialization: "Consumer Rights, Civil Law",
    rating: 4.8,
    available: true
  },
  {
    id: "l2",
    name: "Adv. Priya Sharma",
    specialization: "Cyber Law, Fraud",
    rating: 4.9,
    available: true
  },
  {
    id: "l3",
    name: "Adv. Rajesh Kumar",
    specialization: "Property, Tenant Disputes",
    rating: 4.5,
    available: false
  }
];
