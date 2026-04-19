import React, { useState } from 'react';
import { X, Briefcase, Shield, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAppContext } from '../AppContext';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { state } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    law: 'General Indian Law'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user?.id) {
      alert("Intelligence Authentication Required: Please sign in to initialize a permanent docket.");
      return;
    }

    setLoading(true);
    try {
      await api.createCase({
        user_id: state.user.id,
        title: formData.title,
        description: formData.description,
        metadata: {
          law: formData.law,
          strength: 50, // Default for manual entry
          source: 'manual'
        }
      });
      console.log("Docket initialized successfully");
      onSuccess();
      onClose();
      setFormData({ title: '', description: '', law: 'General Indian Law' });
    } catch (error: any) {
      console.error("Failed to create manual case:", error);
      const detail = error.response?.data?.detail || error.message || "Unknown cryptographic failure";
      alert(`System Protocol Error: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const isAuthDisabled = !state.user?.id;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-xl bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden relative z-10 shadow-[0_30px_100px_rgba(0,0,0,1)]"
          >
            <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-manrope font-extrabold text-white tracking-tight">Initialize Docket</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {isAuthDisabled && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                  <Shield className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-500 font-bold uppercase tracking-tight">
                    Guest Mode Active: Sign in to enable secure database persistence for this docket.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Case Identifier (Title)</label>
                <input 
                  required
                  disabled={isAuthDisabled}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Property Dispute - North Delhi"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Statutory Context (Applicable Law)</label>
                <select 
                  disabled={isAuthDisabled}
                  value={formData.law}
                  onChange={(e) => setFormData({...formData, law: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none disabled:opacity-50"
                >
                  <option value="General Indian Law">General Indian Law</option>
                  <option value="Bharatiya Nyaya Sanhita (BNS)">Bharatiya Nyaya Sanhita (BNS)</option>
                  <option value="Consumer Protection Act, 2019">Consumer Protection Act, 2019</option>
                  <option value="Information Technology Act">Information Technology Act</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Factual Narrative (Description)</label>
                  <span className="text-[9px] text-primary/40 uppercase font-bold">Confidential Layer Active</span>
                </div>
                <textarea 
                  required
                  disabled={isAuthDisabled}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the legal situation in detail..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <Shield className="w-4 h-4 text-primary" />
                <p className="text-[11px] text-primary/80 leading-relaxed font-sans">
                  This docket will be initialized using standard cryptographic protocols. You can attach AI analysis to this docket later in the Intelligence Stream.
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading || isAuthDisabled}
                className="w-full bg-primary text-primary-foreground font-manrope font-extrabold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(233,193,118,0.2)] disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Initialize Protocol
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
