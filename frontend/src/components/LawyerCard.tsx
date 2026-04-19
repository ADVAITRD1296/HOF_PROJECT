import React from 'react';
import type { Lawyer } from '../services/mockData';
import { Star, ShieldCheck, Mail, ArrowUpRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface LawyerCardProps {
  data: Lawyer;
}

export const LawyerCard: React.FC<LawyerCardProps> = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden group hover:border-[#e9c176]/30 transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-xl font-bold text-primary group-hover:border-[#e9c176]/50 transition-colors">
            {data.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex flex-col">
            <h3 className="text-white font-manrope font-extrabold text-lg tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
              {data.name}
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
            </h3>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-sans font-medium">{data.specialization}</span>
            {data.distance && (
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {data.distance}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(data.rating) ? 'fill-[#e9c176] text-[#e9c176]' : 'text-white/10'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-white ml-2 font-bold font-manrope">{data.rating}</span>
        </div>
        
        {data.available ? (
          <div className="flex items-center gap-2 text-[10px] text-[#4ADE80] font-bold uppercase tracking-widest px-3 py-1 bg-[#4ADE80]/5 border border-[#4ADE80]/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" />
            Active Now
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">
            In Consult
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-auto">
        <div className="flex items-center text-[10px] text-muted-foreground gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-[#e9c176]" />
          BCI Verified
        </div>
        <button 
          className="flex-1 py-3 px-6 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black font-manrope font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-lg"
        >
          <Mail className="w-4 h-4" />
          Request Access
        </button>
      </div>

      {/* Decorative ambient flare */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#e9c176]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#e9c176]/10 transition-all"></div>
    </motion.div>
  );
};

