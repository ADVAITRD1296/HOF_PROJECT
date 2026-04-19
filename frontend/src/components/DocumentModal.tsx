import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, FileText } from 'lucide-react';
import { api } from '../services/api';
import type { DocumentResult } from '../services/mockData';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'FIR' | 'Complaint' | 'Notice';
  initialDetails?: string;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ 
  isOpen, 
  onClose,
  defaultType = 'FIR',
  initialDetails = ''
}) => {
  const [activeTab, setActiveTab] = useState<'FIR' | 'Complaint' | 'Notice'>(defaultType);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    details: ''
  });
  const [generatedDoc, setGeneratedDoc] = useState<DocumentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync tab with defaultType if it changes
  React.useEffect(() => {
    setActiveTab(defaultType);
    if (initialDetails && !generatedDoc) {
      setFormData(p => ({ ...p, details: initialDetails }));
    }
  }, [defaultType, initialDetails, isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await api.generateDocument({ ...formData, type: activeTab });
      setGeneratedDoc(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedDoc) {
      navigator.clipboard.writeText(generatedDoc.content);
      // Optional: Show toast
    }
  };

  const handleDownload = async () => {
    if (generatedDoc) {
      try {
        await api.downloadPDF(generatedDoc.content, generatedDoc.title.replace(/\s+/g, '_'));
      } catch (err) {
        console.error("Download failed", err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0A0A0A] border-l border-[#222] shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#222]">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Document Generator
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-[#111] border border-[#222] rounded-lg">
                {(['FIR', 'Complaint', 'Notice'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                      activeTab === tab 
                        ? 'bg-[#222] text-white shadow-sm' 
                        : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {!generatedDoc ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-2.5 text-white focus:border-white/40 focus:outline-none transition-colors"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Date of Incident</label>
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                        className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-2.5 text-white focus:border-white/40 focus:outline-none transition-colors [color-scheme:dark]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                        className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-2.5 text-white focus:border-white/40 focus:outline-none transition-colors"
                        placeholder="City / Area"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Incident Details</label>
                    <textarea 
                      value={formData.details}
                      onChange={e => setFormData(p => ({ ...p, details: e.target.value }))}
                      className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none transition-colors min-h-[120px] resize-none"
                      placeholder="Briefly describe what happened..."
                    />
                  </div>
                  
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !formData.name || !formData.details}
                    className="mt-4 w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-[#E8E8E8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isGenerating ? 'Drafting...' : `Generate ${activeTab}`}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{generatedDoc.title}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleCopy}
                        className="p-1.5 rounded-md border border-[#222] text-muted-foreground hover:text-white hover:bg-[#111] transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleDownload}
                        className="p-1.5 rounded-md border border-[#222] text-muted-foreground hover:text-white hover:bg-[#111] transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-[#0F0F0F] rounded-lg border border-[#222] relative group">
                    <pre className="absolute inset-0 overflow-auto p-5 font-mono text-[13px] text-white/90 leading-relaxed whitespace-pre-wrap">
                      {generatedDoc.content}
                    </pre>
                  </div>
                  
                  <button 
                    onClick={() => setGeneratedDoc(null)}
                    className="w-full bg-[#111] text-white font-medium py-3 border border-[#222] rounded-lg hover:bg-[#1A1A1A] transition-colors"
                  >
                    Reset & Edit
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
