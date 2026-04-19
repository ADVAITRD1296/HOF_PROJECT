import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Case } from '../services/mockData';
import { Calendar, ChevronRight } from 'lucide-react';

interface CaseCardProps {
  data: Case;
}

export const CaseCard: React.FC<CaseCardProps> = ({ data }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isFiled = data.status === 'Filed' || data.status === 'Resolved';
  
  // Inline mini strength meter for the card
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.strength / 100) * circumference;

  const history = data.metadata?.history || [];
  const displayTitle = data.title || data.issueType || "Intelligence Case";
  const formattedDate = data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : "Pending Sync";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="glass-panel border border-white/10 hover:border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-500 flex flex-col gap-5 group relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
      onClick={() => navigate(`/dashboard/cases/${data.id}`)}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded">
              {data.law || "Protocol Logic"}
            </span>
          </div>
          <h3 className="text-white font-manrope font-extrabold text-2xl tracking-tighter group-hover:text-primary transition-colors leading-tight">
            {displayTitle}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-full border ${
              isFiled 
                ? 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20 shadow-[0_0_20px_rgba(74,222,128,0.1)]' 
                : 'bg-white/5 text-white border-white/10'
            }`}>
              {data.status}
            </span>
          </div>
        </div>

        {/* Mini Strength Meter */}
        <div className="relative flex items-center justify-center w-16 h-16 group/meter">
          <svg width="64" height="64" className="transform -rotate-90">
            <circle cx="32" cy="32" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, delay: 0.5 }}
              cx="32"
              cy="32"
              r={radius}
              fill="transparent"
              stroke={isFiled ? '#4ADE80' : '#FAFAFA'}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[12px] font-bold text-white font-manrope leading-none">{data.strength || 0}%</span>
            <span className="text-[7px] uppercase font-bold text-muted-foreground mt-0.5">Prob</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-5 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>Sync: {formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
                className="p-1 px-2 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
                History
            </button>
            <div className="text-white bg-white/5 p-1.5 rounded-full border border-white/5 transition-all duration-300 transform">
                <ChevronRight className="w-4 h-4" />
            </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && history.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white/5 rounded-xl mt-4 border border-white/5"
          >
            <div className="p-4 space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                {history.map((item: any, idx: number) => {
                  const content = item.content;
                  const text = typeof content === 'string' 
                    ? content 
                    : (content?.issue || content?.summary || "Analysis Pass");
                  
                  return (
                    <div key={idx} className={`p-2 rounded-lg border ${item.type === 'user' ? 'bg-primary/5 border-primary/20 ml-2' : 'bg-black/20 border-white/5 mr-2'}`}>
                      <p className="text-[8px] uppercase font-bold tracking-tighter opacity-50 mb-0.5">{item.type === 'user' ? 'Citizen' : 'AI'}</p>
                      <p className="text-[10px] text-white/70 leading-tight">
                        {text}
                      </p>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Background flare */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-white/10 transition-all"></div>
    </motion.div>
  );
};

