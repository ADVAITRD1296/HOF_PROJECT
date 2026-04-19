import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {suggestions.map((suggestion, idx) => (
        <motion.button
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onSelect(suggestion)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] hover:border-white/20 hover:bg-white/5 transition-all text-[13px] text-white"
        >
          {suggestion}
          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.button>
      ))}
    </div>
  );
};
