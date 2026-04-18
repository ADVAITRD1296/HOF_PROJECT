import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SmartSuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const SmartSuggestionChips: React.FC<SmartSuggestionChipsProps> = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {suggestions.map((sug, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(sug)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-secondary-container/30 text-secondary border border-secondary/20 hover:bg-secondary-container/60 hover:border-secondary/40 transition-all font-inter"
        >
          {sug}
          <ArrowRight className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};
