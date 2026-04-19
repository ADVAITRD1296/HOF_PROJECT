import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone, Calendar, BadgeCheck, Zap, CreditCard } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const ProfilePage: React.FC = () => {
  const { state } = useAppContext();
  const user = state.user;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl font-manrope font-extrabold text-white tracking-tight">Identity Vault</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 glass-panel p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-foreground p-1 mb-6 shadow-xl shadow-primary/20">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-4 border-black font-manrope text-3xl font-bold text-white uppercase italic">
              {user.name.charAt(0)}
            </div>
          </div>
          
          <h2 className="text-2xl font-manrope font-extrabold text-white mb-1 tracking-tight">{user.name}</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mb-6">Sovereign Scholar</p>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Verified Identity</span>
          </div>

          <div className="w-full space-y-4 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Authority Status</span>
              <span className="text-white font-bold">Active</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Joined Protocol</span>
              <span className="text-white font-bold">April 2024</span>
            </div>
          </div>
        </motion.div>

        {/* Detailed Info */}
        <div className="md:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-white/5 shadow-2xl"
          >
            <h3 className="text-sm font-manrope font-extrabold text-primary uppercase tracking-[0.3em] mb-8">Communication Channels</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-white/5 rounded-xl">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Email Address</p>
                  <p className="text-white font-serif italic text-lg">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-white/5 rounded-xl">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Secure Line</p>
                  <p className="text-white font-serif italic text-lg">+91 ••••• ••902</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-[#e9c176]/20 to-[#e9c176]/5 rounded-2xl border border-[#e9c176]/20">
                <CreditCard className="w-6 h-6 text-[#e9c176]" />
              </div>
              <div>
                <h3 className="text-lg font-manrope font-extrabold text-white tracking-tight">Intelligence Tier</h3>
                <p className="text-sm text-muted-foreground">Platinum Protocol • Unlimited RAG Access</p>
              </div>
            </div>
            <button className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all">
              Manage
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
