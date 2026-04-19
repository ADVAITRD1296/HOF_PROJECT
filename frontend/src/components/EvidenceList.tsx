import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Shield } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const EvidenceList: React.FC = () => {
  const { attachedFiles, setAttachedFiles } = useAppContext();

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  if (attachedFiles.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] w-max">
        <Shield className="w-3.5 h-3.5 text-[#4ADE80]" />
        <span className="text-[11px] font-medium text-white/70 uppercase tracking-widest">
          {attachedFiles.length} Evidence File{attachedFiles.length > 1 ? 's' : ''} Encryption-Secured
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {attachedFiles.map((file, idx) => (
            <motion.div
              key={`${file.name}-${idx}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] hover:border-white/20 transition-all group"
            >
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-white max-w-[120px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(idx)}
                className="p-0.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                aria-label="Remove file"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
