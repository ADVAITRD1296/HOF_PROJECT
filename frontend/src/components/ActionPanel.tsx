import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FileWarning, Mail, ArrowRight, Share2, Sparkles } from 'lucide-react';

interface ActionPanelProps {
  onAction: (action: string) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onAction }) => {
  const actions = [
    { label: 'Start Case', icon: Sparkles, id: 'StartCase', primary: true },
    { label: 'Draft FIR', icon: FileWarning, id: 'FIR', primary: true },
    { label: 'Draft Complaint', icon: FileText, id: 'Complaint', primary: true },
    { label: 'Draft Notice', icon: Mail, id: 'Notice', primary: true },
    { label: 'Next Protocol', icon: ArrowRight, id: 'NextStep' },
    { label: 'Export Brief', icon: Share2, id: 'Share' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-white/5">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction(action.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all text-sm font-manrope font-bold shadow-lg ${
              action.primary 
                ? 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-primary/50' 
                : 'bg-black/10 border-white/5 text-muted-foreground hover:text-white hover:border-white/10'
            }`}
          >
            <Icon className={`w-4 h-4 ${action.primary ? 'text-primary' : 'text-muted-foreground'}`} />
            {action.label}
            {action.primary && <Sparkles className="w-3 h-3 text-primary/50 animate-pulse ml-1" />}
          </motion.button>
        );
      })}
    </div>
  );
};

