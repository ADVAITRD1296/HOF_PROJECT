export interface LegalStep {
  stepNumber: number;
  title: string;
  explanation: string;
}

export interface Law {
  act: string;
  section: string;
  title: string;
  explanation: string;
  confidenceScore: number;
  sourceUrl: string;
}

export interface LegalGuidanceResponse {
  steps: LegalStep[];
  applicable_laws: Law[];
  suggested_actions: string[];
  ai_response: string;
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const fetchLegalGuidance = async (_query: string, language: 'en' | 'hi'): Promise<LegalGuidanceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: _query,
        language: language,
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Backend unreachable, falling back to mock UI...", error);
    // Fallback if backend isn't actually running so the UI doesn't break
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ai_response: language === 'en' 
            ? "Based on the details you provided, this appears to be a case of online financial fraud. Here is your structured legal action plan."
            : "आपकी दी गई जानकारी के आधार पर, यह ऑनलाइन वित्तीय धोखाधड़ी का मामला प्रतीत होता है। यहाँ आपकी कानूनी कार्रवाई योजना है।",
          steps: [
            { stepNumber: 1, title: language === 'en' ? "Preserve Evidence" : "सबूत सुरक्षित रखें", explanation: language === 'en' ? "Take screenshots of all chats, payment receipts, and profiles." : "सभी चैट, भुगतान रसीदें और प्रोफ़ाइल के स्क्रीनशॉट लें।" },
            { stepNumber: 2, title: language === 'en' ? "Call 1930" : "1930 पर कॉल करें", explanation: language === 'en' ? "Immediately call the Cyber Crime Helplne to freeze the transaction." : "लेनदेन को फ्रीज करने के लिए तुरंत साइबर क्राइम हेल्पलाइन पर कॉल करें।" },
            { stepNumber: 3, title: language === 'en' ? "Register Complaint" : "शिकायत दर्ज करें", explanation: language === 'en' ? "File a complaint on cybercrime.gov.in." : "cybercrime.gov.in पर शिकायत दर्ज करें।" },
          ],
          applicable_laws: [{
            act: "Bharatiya Nyaya Sanhita (BNS)",
            section: "318(4)",
            title: "Cheating and dishonestly inducing delivery of property",
            explanation: "This section applies when someone deceives you intentionally to deliver property (like money in an online scam). Since you paid money for goods never delivered, this constitutes a prima facie case.",
            confidenceScore: 95,
            sourceUrl: "https://indiankanoon.org"
          }],
          suggested_actions: ["Generate FIR Draft →", "Find Cyber Lawyer →", "Call 1930 Now →"]
        });
      }, 1000);
    });
  }
};

export const generateDocument = async (type: string, userDetails: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userDetails.details || "",
        doc_type: type,
        user_details: userDetails,
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend unreachable, falling back to mock generator...", error);
    return new Promise<{ document_text: string; pdf_url: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          document_text: `[DRAFT - ${type.toUpperCase()}]\n\nTo,\nThe Station House Officer,\nCyber Crime Police Station,\n\nSubject: Complaint regarding online financial fraud.\n\nRespected Sir/Madam,\n\nI am writing to report a fraudulent incident...\n\nDetails provided: ${userDetails.details}\n\nPlease take immediate legal action under applicable laws.`,
          pdf_url: "#"
        });
      }, 1500);
    });
  }
};
