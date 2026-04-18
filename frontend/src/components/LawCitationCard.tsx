import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ExternalLink, ChevronDown, CheckCircle } from 'lucide-react';

interface LawCitationCardProps {
  act: string;
  section: string;
  title: string;
  explanation: string;
  confidenceScore: number;
  sourceUrl: string;
}

export const LawCitationCard: React.FC<LawCitationCardProps> = ({
  act,
  section,
  title,
  explanation,
  confidenceScore,
  sourceUrl
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full rounded-xl bg-surface-container-low ghost-border overflow-hidden my-4 border-l-4 border-l-tertiary">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-surface-container-highest rounded-lg">
            <BookOpen className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h4 className="font-manrope font-semibold text-white">
                {act} Section {section}
              </h4>
              <span className="text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-400 rounded-sm flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {confidenceScore}% Match
              </span>
            </div>
            <p className="text-sm text-primary/70">{title}</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-outline transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-surface-container-low"
          >
            <div className="p-4 pt-0 border-t border-outline-variant/15 mt-2">
              <div className="mt-4 p-4 rounded-lg bg-tertiary/5 ghost-border">
                <h5 className="text-xs font-bold uppercase tracking-wider text-tertiary mb-2">Why this applies to you</h5>
                <p className="text-sm leading-relaxed text-primary/90">{explanation}</p>
              </div>
              <a 
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-secondary hover:underline"
              >
                Read Official Source on India Kanoon <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
