import { axiosInstance } from './axiosInstance';
import type { 
  LegalResponse, 
  DocumentResult, 
  Case, 
  Lawyer, 
  UploadResult,
} from './mockData';
import {
  mockCases,
  mockLawyers
} from './mockData';

export const api = {
  async getLegalGuidance(query: string, files?: File[], language: 'en' | 'hi' = 'en', city: string = 'India', context?: string): Promise<LegalResponse> {
    try {
      const formData = new FormData();
      formData.append('query', query);
      formData.append('language', language);
      formData.append('city', city);
      if (context) formData.append('context', context);

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await axiosInstance.post('/guidance/ask', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      // Map Backend (GuidanceResponse) -> Frontend (LegalResponse)
      return {
        issue: data.issue || data.query || "Legal Query Analysis",
        law: data.law || (data.citations?.[0] ? `${data.citations[0].act} - Section ${data.citations[0].section}` : "Relevant Indian Law"),
        reason: data.reason || data.citations?.[0]?.why_applicable || data.summary,
        summary: data.summary,
        detailed_analysis: data.detailed_analysis || data.summary,
        strength: data.strength || 75,
        steps: data.steps.map((s: any) => ({
          step_number: s.step_number,
          title: s.title,
          description: s.description,
          action_required: s.action_required
        })),
        next_steps: data.suggested_actions || ["Consult a Lawyer", "Generate Notice"],
        cases: (data.precedents || []).map((p: any, idx: number) => ({
          id: `case-${idx}`,
          title: p.title,
          year: parseInt(p.citation?.match(/\d{4}/)?.[0] || "2024"),
          relevance: p.relevance
        })),
        location_guidance: data.location_guidance
      };
    } catch (error) {
      console.error("API Error (getLegalGuidance):", error);
      throw error;
    }
  },

  async generateDocument(data: any): Promise<DocumentResult> {
    try {
      const response = await axiosInstance.post('/guidance/generate-document', {
        query: data.details,
        doc_type: data.type.toLowerCase(),
        language: "en",
        user_details: {
          name: data.name,
          location: data.location,
          date: data.date
        }
      });

      const result = response.data;
      return {
        id: "doc_" + Math.random().toString(36).substr(2, 9),
        title: result.title || `${data.type} - ${data.name}`,
        content: result.document,
        type: data.type as 'FIR' | 'Complaint' | 'Notice'
      };
    } catch (error) {
      console.error("API Error (generateDocument):", error);
      throw error;
    }
  },

  async getCases(userId?: string): Promise<Case[]> {
    if (!userId) {
      // Falling back to mocks for UI demonstration if not logged in
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCases;
    }

    try {
      const response = await axiosInstance.get(`/cases/${userId}`);
      return response.data.map((c: any) => ({
        id: c.id,
        title: c.title || "Untitled Intelligence",
        status: c.status || 'Action pending',
        description: c.description,
        strength: c.metadata?.strength || 70,
        law: c.metadata?.law || "Indian Statutes",
        lastUpdated: c.created_at, // Match interface
        metadata: c.metadata
      }));
    } catch (error) {
      console.warn("Backend /cases failed, using mock data", error);
      return mockCases;
    }
  },
  async getCaseById(caseId: string, userId?: string): Promise<Case | null> {
    const allCases = await this.getCases(userId);
    return allCases.find(c => c.id === caseId) || null;
  },

  async updateCaseMetadata(caseId: string, metadata: any): Promise<any> {
    try {
      const response = await axiosInstance.patch(`/cases/${caseId}`, { metadata });
      return response.data;
    } catch (error) {
      console.error("API Error (updateCaseMetadata):", error);
      throw error;
    }
  },

  async getLawyers(query?: string, lat?: number, lon?: number): Promise<Lawyer[]> {
    try {
      const response = await axiosInstance.post('/lawyers/match', {
        user_query: query || "general legal help",
        latitude: lat || 28.6139,
        longitude: lon || 77.2090,
        radius_km: 50 // localized search
      });

      return response.data.map((l: any) => ({
        id: l.id,
        name: l.full_name,
        specialization: l.practice_areas.join(', '),
        rating: 4.8, 
        available: l.status === 'Active' || l.status === 'Approved',
        distance: l.distance_km ? `${l.distance_km.toFixed(1)} km` : undefined
      }));
    } catch (error) {
      console.warn("Backend /lawyers/match failed, using mock data", error);
      return mockLawyers;
    }
  },

  async registerLawyer(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post('/lawyers/register', data);
      return response.data;
    } catch (error) {
      console.error("API Error (registerLawyer):", error);
      throw error;
    }
  },

  async uploadFile(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        filename: response.data.filename,
        size: response.data.size,
        secured: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("API Error (uploadFile):", error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error("API Error (login):", error);
      throw error;
    }
  },

  async register(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/register', {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || "0000000000",
        password: data.password
      });
      return response.data;
    } catch (error) {
      console.error("API Error (register):", error);
      throw error;
    }
  },

  async listDocuments(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/documents/list');
      return response.data.documents || [];
    } catch (error) {
      console.warn("Backend /documents/list failed, returning empty", error);
      return [];
    }
  },
  async downloadPDF(content: string, filename: string): Promise<void> {
    try {
      const response = await axiosInstance.post('/guidance/download-pdf', {
        content,
        filename
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("API Error (downloadPDF):", error);
      throw error;
    }
  },

  async createCase(data: { user_id: string; title: string; description: string; metadata?: any }): Promise<any> {
    try {
      const response = await axiosInstance.post('/cases/', data);
      return response.data;
    } catch (error) {
      console.error("API Error (createCase):", error);
      throw error;
    }
  },
  
  async getNearbyLegalServices(query: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/location/get-nearby-legal-services', {
        query
      });
      return response.data;
    } catch (error) {
      console.error("API Error (getNearbyLegalServices):", error);
      throw error;
    }
  },

  async sendLawyerOTP(email: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/lawyers/send-otp', {
        identifier: email,
        method: 'email'
      });
      return response.data;
    } catch (error) {
      console.error("API Error (sendLawyerOTP):", error);
      throw error;
    }
  },

  async verifyLawyerOTP(email: string, code: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/lawyers/verify-otp', {
        identifier: email,
        code: code
      });
      return response.data;
    } catch (error) {
      console.error("API Error (verifyLawyerOTP):", error);
      throw error;
    }
  },

  async analyzeCaseStrength(data: {
    case_description: string;
    evidence_list: string[];
    witnesses: boolean;
    documentation: boolean;
    case_type: string;
  }): Promise<any> {
    try {
      const response = await axiosInstance.post('/extensions/case-strength/analyze', data);
      return response.data;
    } catch (error) {
      console.error("API Error (analyzeCaseStrength):", error);
      throw error;
    }
  },

  async estimateCaseDuration(data: {
    case_type: string;
    court_level: string;
    complexity: string;
    jurisdiction?: string;
  }): Promise<any> {
    try {
      const response = await axiosInstance.post('/extensions/case-duration/estimate', data);
      return response.data;
    } catch (error) {
      console.error("API Error (estimateCaseDuration):", error);
      throw error;
    }
  }
};
