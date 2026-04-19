import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ExternalLink, FileText, Info, ShieldAlert, Gavel, Map } from 'lucide-react';
import type { LocationGuidance as LocationGuidanceType } from '../services/mockData';

interface LocationGuidanceProps {
  data: LocationGuidanceType;
}

export const LocationGuidance: React.FC<LocationGuidanceProps> = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Authorities */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20">
              <Gavel className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Primary Authorities</h3>
          </div>
          {data.primary_authorities.map((auth, idx) => (
            <div key={idx} className="p-5 glass-panel border border-white/10 rounded-2xl flex flex-col gap-3 group hover:border-primary/30 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm leading-tight">{auth.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{auth.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <a 
                  href={auth.maps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Map className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[12px] text-white/70 leading-relaxed pl-13 border-l border-primary/20 pl-4">{auth.reason}</p>
            </div>
          ))}
        </div>

        {/* Helplines and Required Docs */}
        <div className="flex flex-col gap-6">
          {/* Helplines */}
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/20 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Emergency Protocol</span>
                   <span className="text-2xl font-manrope font-black text-white">{data.helpline}</span>
                 </div>
               </div>
               <a href={`tel:${data.helpline}`} className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">Call Now</a>
            </div>
            <p className="text-[12px] text-primary/80 font-medium italic">"{data.urgency}"</p>
          </div>

          {/* Checklist */}
          <div className="p-6 glass-panel border border-white/10 rounded-2xl shadow-xl">
             <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-[#e9c176]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Document Ingestion Requirement</h3>
            </div>
            <div className="space-y-3">
              {data.required_documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/80 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  {doc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

       {/* Protocol Instructions */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Procedural Narrative</h3>
            </div>
            <p className="text-[13px] text-white/70 italic bg-black/40 p-4 rounded-xl border border-white/5">"{data.what_to_say}"</p>
          </div>

          <div className="p-6 bg-[#F87171]/5 border border-[#F87171]/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-[#F87171]" />
              <h3 className="text-xs font-bold text-[#F87171] uppercase tracking-widest">Escalation Protocol</h3>
            </div>
            <p className="text-[13px] text-white/70">{data.next_step}</p>
            {data.online_option && (
              <a 
                href={data.online_option} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-[11px] font-bold text-[#F87171] uppercase tracking-tighter border-b border-[#F87171]/40 hover:border-[#F87171] transition-all"
              >
                Access Online Filing Portal <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
       </div>
    </motion.div>
  );
};
