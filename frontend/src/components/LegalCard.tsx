import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LegalCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  defaultExpanded?: boolean;
}

export const LegalCard: React.FC<LegalCardProps> = ({ 
  title, 
  icon, 
  children, 
  delay = 0,
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col border border-white/10 hover:border-white/20 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.3)] group"
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-5 w-full text-left transition-colors relative"
      >
        <div className="flex items-center gap-4 z-10">
          <div className="text-primary w-6 h-6 flex justify-center items-center opacity-80 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
          <h3 className="text-white font-manrope font-bold text-base tracking-tight">{title}</h3>
        </div>
        <div className="z-10 bg-white/5 p-1 rounded-full border border-white/5">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-6 pb-6 overflow-hidden"
          >
            <div className="pt-4 border-t border-white/10 font-sans text-[15px] leading-relaxed text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

