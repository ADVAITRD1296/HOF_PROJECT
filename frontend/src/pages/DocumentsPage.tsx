import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { DocumentModal } from '../components/DocumentModal';
import { FilePlus, Shield, FolderOpen, History } from 'lucide-react';
import { motion } from 'framer-motion';

export const DocumentsPage: React.FC = () => {
  const [docModalOpen, setDocModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-4xl font-manrope font-extrabold text-white tracking-tight">Documents</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground font-sans text-sm">Centralized vault for encrypted legal artifacts and dynamic draft generation.</p>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
              <Shield className="w-3 h-3 text-[#4ADE80]" /> 
              Zero-Knowledge Storage
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDocModalOpen(true)}
          className="bg-white text-black font-manrope font-extrabold px-6 py-3 rounded-2xl hover:bg-[#E8E8E8] transition-all flex items-center gap-2 shadow-xl"
        >
          <FilePlus className="w-5 h-5" />
          Generate Draft
        </motion.button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-12">
        <div className="grid grid-cols-1 gap-12">
          <section>
            <div className="flex items-center gap-3 mb-6 px-2">
              <History className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Transfer Artifacts</h2>
            </div>
            <FileUpload />
          </section>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
          <Shield className="w-3 h-3 text-primary" />
          AES-256 Bit Encryption Enforced
        </div>
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
          Secure Document Vault Protocol v12.4
        </p>
      </div>

      <DocumentModal 
        isOpen={docModalOpen} 
        onClose={() => setDocModalOpen(false)} 
      />
    </div>
  );
};

