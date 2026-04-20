import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../AppContext';
import { api } from '../services/api';
import { CaseCard } from '../components/CaseCard';
import { NewCaseModal } from '../components/NewCaseModal';
import { Briefcase, Activity, PlusCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CasesPage: React.FC = () => {
  const { cases, setCases, state, activeChatHistory } = useAppContext();
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  const fetchCases = useCallback(() => {
    api.getCases(state.user?.id).then(setCases);
  }, [state.user?.id, setCases]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Create a virtual case for the current active session history
  const activeSessionCase = activeChatHistory.length > 0 ? {
    id: "live-session",
    title: "Current Active Session",
    status: "Action pending",
    strength: 0,
    law: "In Progress",
    lastUpdated: new Date().toISOString(),
    metadata: { history: activeChatHistory }
  } as any : null;

  const displayCases = activeSessionCase ? [activeSessionCase, ...cases] : cases;

  return (
    <div className="flex flex-col h-full w-full">
      <NewCaseModal 
        isOpen={isNewCaseModalOpen} 
        onClose={() => setIsNewCaseModalOpen(false)} 
        onSuccess={fetchCases}
      />
      {/* Header logic... */}
      <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-4xl font-manrope font-extrabold text-white tracking-tight">Case Repository</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-muted-foreground font-sans text-xs md:text-sm">Real-time tracking of litigation strategy and probability metrics.</p>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
              <Activity className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary animate-pulse" /> 
              Active Monitoring
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsNewCaseModalOpen(true)}
          className="w-full md:w-auto bg-primary text-primary-foreground font-manrope font-extrabold px-6 py-3 rounded-xl md:rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(233,193,118,0.2)]"
        >
          <PlusCircle className="w-5 h-5" />
          New Docket
        </motion.button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-12">
        <AnimatePresence mode="wait">
          {displayCases.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {displayCases.map(c => (
                <CaseCard key={c.id} data={c} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-20 glass-panel border border-white/5 rounded-3xl opacity-40 text-center"
            >
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <p className="font-manrope text-xl font-bold uppercase tracking-[0.2em] text-white">No Active Dockets</p>
              <p className="text-sm mt-2 max-w-xs font-sans text-muted-foreground">Initialize a legal situation in the Assistant Page to generate your first case analysis.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Status */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] font-sans">
          Enforced Multi-Signature Security Registry — System Online
        </div>
      </div>
    </div>
  );
};

