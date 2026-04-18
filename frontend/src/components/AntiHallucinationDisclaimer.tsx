import React from 'react';
import { AlertCircle } from 'lucide-react';

export const AntiHallucinationDisclaimer: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-outline-variant/20 py-3 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm text-outline">
        <AlertCircle className="w-4 h-4 text-tertiary" />
        <p className="font-inter">
          <strong className="text-primary font-medium">LexisCo provides AI-guided legal assistance, not legal advice.</strong> Always consult a certified lawyer for your case.
        </p>
      </div>
    </div>
  );
};
