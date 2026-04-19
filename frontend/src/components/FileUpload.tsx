import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, Lock } from 'lucide-react';
import { api } from '../services/api';
import type { UploadResult } from '../services/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export const FileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await api.uploadFile(file);
      setUploads(prev => [res, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
      {/* Upload Zone */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative group cursor-pointer w-full p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-500 overflow-hidden ${
          isDragging ? 'border-primary bg-primary/5 shadow-[0_0_40px_rgba(255,255,255,0.05)]' : 'border-white/10 hover:border-white/20 bg-black/40'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className={`w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:bg-white/10 ${isDragging ? 'scale-110 !bg-primary/20 !border-primary/30' : ''}`}>
          <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-primary' : 'text-muted-foreground group-hover:text-white'}`} />
        </div>
        <h3 className="text-white font-manrope font-extrabold text-2xl mb-2 tracking-tight">Upload Protocol</h3>
        <p className="text-muted-foreground font-sans text-sm text-center max-w-sm mb-6">
          Initialize secure artifact transfer. Drag and drop case documents or <span className="text-primary font-bold cursor-pointer">browse filesystem</span>.
        </p>
        
        <div className="flex gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
          PDF • DOCX • JPG • TXT
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity">
            <div className="w-10 h-10 border-2 border-white/10 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-white font-manrope font-bold text-sm uppercase tracking-widest">Encrypting Transfer...</p>
          </div>
        )}
      </motion.div>

      {/* Security Banner */}
      <div className="glass-panel border border-white/5 p-5 rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-[#e9c176]/10 rounded-xl border border-[#e9c176]/20 shadow-[0_0_15px_rgba(233,193,118,0.1)]">
          <Lock className="w-5 h-5 text-[#e9c176]" />
        </div>
        <div>
          <span className="text-white font-manrope font-extrabold block text-base tracking-tight italic">LexisCo Quantum Encryption</span>
          <span className="text-muted-foreground text-xs font-sans">End-to-end zero-knowledge storage protocol enforced on all artifacts.</span>
        </div>
      </div>

      {/* Uploaded List */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Secured Evidence Repository</h4>
              <span className="text-[10px] font-mono text-muted-foreground">{uploads.length} Artifacts Synced</span>
            </div>
            {uploads.map((upload, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-5 glass-panel border border-white/10 rounded-2xl hover:border-white/20 transition-all hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4 relative">
                  <div className="p-3 bg-black/60 rounded-xl border border-white/5">
                    <File className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-manrope font-bold text-white tracking-tight">{upload.filename}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-sans">{(upload.size / 1024 / 1024).toFixed(2)} MB • Archive Synced</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(74,222,128,0.05)]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Secured
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

