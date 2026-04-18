import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Share2, FileText, Pickaxe, CheckCircle2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { generateDocument } from '../services/api';

export const ComplaintFIRGenerator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState('');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!details) return;
    setIsGenerating(true);
    setStep(2);
    try {
      const res = await generateDocument('FIR', { details });
      setDraft(res.document_text);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `<div style="font-family: sans-serif; padding: 40px; position: relative;">
      ${draft.replace(/\\n/g, '<br/>')}
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); opacity: 0.1; font-size: 60px; pointer-events: none; color: red; width: max-content;">AI-Generated Draft</div>
    </div>`;
    html2pdf().from(element).save('LexisCo_Draft.pdf');
  };

  return (
    <div className="w-full bg-surface-container-low rounded-xl ghost-border overflow-hidden p-6 mb-6">
      <div className="flex items-center gap-3 border-b border-outline-variant/15 pb-4 mb-6">
        <FileText className="w-6 h-6 text-tertiary" />
        <h3 className="text-xl font-manrope font-semibold text-white">Document Generator</h3>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-secondary text-surface-container-lowest' : 'bg-surface-container-highest text-outline'}`}>
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 mx-2 rounded-full ${step > s ? 'bg-secondary' : 'bg-surface-container-highest'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Describe */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label className="block text-sm font-medium text-primary/80 mb-2">Describe the Incident (Include facts, dates, amounts if applicable)</label>
          <textarea 
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full h-32 p-4 bg-surface rounded-lg ghost-border text-white focus:outline-none focus:border-secondary transition-colors resize-none mb-4"
            placeholder="E.g., On 15th March, I received a message from..."
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2 bg-primary text-surface-container-lowest rounded hover:bg-white font-medium transition-colors float-right disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Draft'}
          </button>
        </motion.div>
      )}

      {/* Step 2: Generating */}
      {step === 2 && (
        <div className="py-12 flex flex-col items-center justify-center">
          <Pickaxe className="w-10 h-10 text-secondary animate-bounce mb-4" />
          <h4 className="font-manrope text-lg text-white font-semibold">Drafting Legal Document...</h4>
          <p className="text-outline text-sm">Applying templates against Bharatiya Nagarik Suraksha Sanhita (BNSS)...</p>
        </div>
      )}

      {/* Step 3: Review & Action */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative bg-surface rounded-lg p-6 mb-6 min-h-[200px]">
             {/* Watermark */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
                <span className="text-4xl lg:text-6xl font-bold uppercase transform -rotate-12 whitespace-nowrap">AI-Generated Draft — Verify with a Lawyer</span>
             </div>
             <pre className="relative z-10 whitespace-pre-wrap font-inter text-sm text-primary/90">
               {draft}
             </pre>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={() => navigator.clipboard.writeText(draft)}
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant/50 rounded hover:bg-surface-container transition-colors text-sm"
            >
              <Copy className="w-4 h-4" /> Copy Text
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded hover:bg-secondary/20 transition-colors text-sm"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button 
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(draft)}`)}
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded hover:bg-[#25D366]/20 transition-colors text-sm focus:outline-none"
            >
              <Share2 className="w-4 h-4" /> WhatsApp Share
            </button>
          </div>
          <button onClick={() => { setStep(1); setDraft(''); }} className="mt-4 text-xs text-outline hover:text-primary underline">Start Over</button>
        </motion.div>
      )}
    </div>
  );
};
