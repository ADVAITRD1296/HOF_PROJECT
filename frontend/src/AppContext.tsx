import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { LegalResponse, Case, DocumentResult } from './services/mockData';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AppContextType {
  userInput: string;
  setUserInput: (input: string) => void;
  aiResponse: LegalResponse | null;
  setAiResponse: (response: LegalResponse | null) => void;
  cases: Case[];
  setCases: (cases: Case[]) => void;
  documents: DocumentResult[];
  setDocuments: (docs: DocumentResult[]) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  attachedFiles: File[];
  setAttachedFiles: (files: File[]) => void;
  // State for Auth
  state: {
    user: User | null;
  };
  setState: React.Dispatch<React.SetStateAction<{ user: User | null }>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInput, setUserInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<LegalResponse | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [documents, setDocuments] = useState<DocumentResult[]>([]);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  
  // Auth state
  const [state, setState] = useState<{ user: User | null }>({
    user: JSON.parse(localStorage.getItem('lexisco_user') || 'null')
  });

  // Sync user to localStorage
  React.useEffect(() => {
    if (state.user) {
      localStorage.setItem('lexisco_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('lexisco_user');
    }
  }, [state.user]);

  return (
    <AppContext.Provider value={{
      userInput, setUserInput,
      aiResponse, setAiResponse,
      cases, setCases,
      documents, setDocuments,
      language, setLanguage,
      isLoading, setIsLoading,
      attachedFiles, setAttachedFiles,
      state, setState
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
