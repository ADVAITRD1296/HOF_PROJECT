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
  metadata?: any;
}

export interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  available: boolean;
  distance?: string;
  email?: string;
  phone?: string;
  address?: string;
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
    {
      step_number: 1,
      title: "Send Legal Notice",
      description: "Send a formal Legal Notice to the service provider giving them 15 days to resolve the issue.",
      action_required: "Draft Notice"
    },
    {
      step_number: 2,
      title: "File NCH Complaint",
      description: "If unresolved, file a formal complaint online at the National Consumer Helpline (NCH) portal.",
      action_required: "Visit NCH Portal"
    },
    {
      step_number: 3,
      title: "Consumer Commission",
      description: "Draft a formal complaint for the District Consumer Disputes Redressal Commission if NCH yields no result.",
      action_required: "Prepare Litigation"
    }
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
  detailed_analysis: "The transaction history and communication logs provide substantiative evidence of a breach of contract and deficiency in service as defined under Section 35 of the Consumer Protection Act, 2019. Jurisdictional factors align with your current location for filing at the District Commission.",
  strength: 82,
};

export const mockCases: Case[] = [
  {
    id: "case_101",
    title: "E-Commerce Refund Protocol",
    issueType: "E-Commerce Fraud",
    status: "Action pending",
    strength: 82,
    law: "Consumer Protection Act, 2019",
    lastUpdated: "2026-04-18",
    metadata: {
      history: [
        { type: 'user', content: "I was overcharged by an e-commerce platform for a defective product." },
        { type: 'ai', content: { summary: "This appears to be a clear violation of consumer rights. You are entitled to a refund and compensation for deficiency in service." } }
      ]
    }
  },
  {
    id: "case_102",
    title: "Residential Tenancy Dispute",
    issueType: "Tenant Dispute",
    status: "Filed",
    strength: 95,
    law: "Rent Control Act",
    lastUpdated: "2026-04-05",
    metadata: {
      history: [
        { type: 'user', content: "The landlord is refusing to return my security deposit without valid reason." },
        { type: 'ai', content: { summary: "Under the Rent Control Act, security deposits must be returned within 30 days of vacation, subject to legal deductions." } }
      ]
    }
  }
];

export const mockLawyers: Lawyer[] = [
  {
    id: "l1",
    name: "Adv. Sanjay Verma",
    specialization: "Consumer Rights, Civil Law",
    rating: 4.8,
    available: true,
    email: "sanjay.verma@lexisco.com",
    phone: "+91 98765 43210"
  },
  {
    id: "l2",
    name: "Adv. Priya Sharma",
    specialization: "Cyber Law, Fraud",
    rating: 4.9,
    available: true,
    email: "priya.law@lexisco.com",
    phone: "+91 87654 32109"
  },
  {
    id: "l3",
    name: "Adv. Rajesh Kumar",
    specialization: "Property, Tenant Disputes",
    rating: 4.5,
    available: false,
    email: "rajesh.kumar@lexisco.com",
    phone: "+91 76543 21098"
  }
];
