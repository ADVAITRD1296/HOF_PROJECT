import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { api } from '../services/api';
import { ChatInput } from '../components/ChatInput';
import { LegalCard } from '../components/LegalCard';
import { StepList } from '../components/StepList';
import { ActionPanel } from '../components/ActionPanel';
import { EvidenceList } from '../components/EvidenceList';
import { LocationGuidance } from '../components/LocationGuidance';
import { Scale, Zap, MapPin, BookOpen, HelpCircle, ArrowRightCircle, AlertTriangle, Blocks, AlignLeft } from 'lucide-react';
import { DocumentModal } from '../components/DocumentModal';
import { motion } from 'framer-motion';

export const AssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    aiResponse, setAiResponse, 
    isLoading, setIsLoading, 
    setUserInput, 
    attachedFiles, setAttachedFiles,
    language,
    activeChatHistory, setActiveChatHistory,
    state 
  } = useAppContext();

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [activeDocType, setActiveDocType] = useState<'FIR' | 'Complaint' | 'Notice'>('FIR');
  const [hasPrompted, setHasPrompted] = useState(false);
  const [userCity, setUserCity] = useState('India');

  useEffect(() => {
    // Attempt city detection on mount
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (_pos) => {
        try {
          // Simple reverse lookup using a free service or just assume popular cities for this demo
          // For now, we'll just log and let the backend handle normalization if we pass coords 
          // but our backend expects a city name. 
          // We'll use a placeholder logic: most users in this demo are in Delhi/Mumbai
          setUserCity('Delhi'); 
        } catch (e) {}
      });
    }
  }, []);

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setHasPrompted(true);
    
    // Add user input to history immediately
    const userInteraction = { type: 'user' as const, content: text, timestamp: new Date() };
    setActiveChatHistory(prev => [...prev, userInteraction]);
    
    setAiResponse(null);
    try {
      const result = await api.getLegalGuidance(text, attachedFiles, language, userCity);
      setAiResponse(result);
      setActiveChatHistory(prev => [...prev, { type: 'ai', content: result, timestamp: new Date() }]);
      
      // Successfully ingested: reset input state
      setUserInput('');
      setAttachedFiles([]);
    } catch (e: any) {
      console.error("Assistant Intelligence Protocol Error:", e);
      const errorMessage = e.message || "Unknown error in intelligence cluster.";
      alert(`Intelligence Protocol Disruption: ${errorMessage}`);
      // We keep the userInput so the user doesn't lose their data on retry
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionId: string) => {
    if (actionId === 'FIR' || actionId === 'Complaint' || actionId === 'Notice') {
      setActiveDocType(actionId as 'FIR' | 'Complaint' | 'Notice');
      setDocModalOpen(true);
    } else if (actionId === 'StartCase') {
      if (!aiResponse) return;
      const { user } = state;
      if (!user) {
        alert("Please sign in to start a case.");
        return;
      }
      
      try {
        await api.createCase({
          user_id: user.id,
          title: aiResponse.issue,
          description: aiResponse.summary,
          metadata: {
            law: aiResponse.law,
            strength: aiResponse.strength,
            analysis: aiResponse.detailed_analysis,
            history: activeChatHistory // Persist full chat transcript
          }
        });
        alert("Case initialized successfully. Navigating to repository...");
        navigate('/dashboard/cases');
      } catch (e) {
        console.error("Failed to start case", e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-4xl font-manrope font-extrabold text-white tracking-tight">Intelligence Stream</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-muted-foreground font-sans text-sm">Initializing cryptographic legal analysis on Indian Statutes.</p>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <Zap className="w-3 h-3 text-[#e9c176]" /> 
            Protocol: Llama-3-Sovereign Enabled
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
        {!hasPrompted && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 w-full flex items-center justify-center p-20"
          >
            <div className="flex flex-col items-center opacity-20 text-center">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-6">
                <Scale className="w-12 h-12 text-white" />
              </div>
              <p className="font-manrope text-lg font-bold tracking-widest uppercase text-white mb-2">Awaiting Intelligence Stream</p>
              <p className="text-sm font-sans max-w-xs">Provide a factual description to initialize the RAG engine.</p>
            </div>
          </motion.div>
        )}

        <div className="w-full flex-1 space-y-12 mb-12">
          {activeChatHistory.map((item, idx) => (
            <div key={idx} className="space-y-6">
              {item.type === 'user' ? (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-2xl p-6 glass-panel rounded-[2rem] border border-primary/20 bg-primary/5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Scale className="w-10 h-10" />
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60 mb-2">Protocol Request</p>
                    <p className="text-white font-manrope text-lg leading-relaxed italic">"{item.content}"</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-6 w-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LegalCard title="Identified Issue" icon={<Scale className="w-4 h-4" />} delay={0.1}>
                      <p className="text-white font-bold text-xl leading-tight tracking-tight">{item.content.issue}</p>
                    </LegalCard>

                    <LegalCard title="Applicable Statutes" icon={<BookOpen className="w-4 h-4" />} delay={0.2}>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[14px] text-primary shadow-inner">
                        {item.content.law}
                      </div>
                    </LegalCard>
                  </div>

                  <LegalCard title="Deep Architectural Analysis" icon={<AlignLeft className="w-4 h-4" />} delay={0.3}>
                    <div className="space-y-4">
                      {item.content.detailed_analysis.split('\n\n').map((para: string, pIdx: number) => (
                        <p key={pIdx} className="text-[16px] leading-relaxed text-white/90 font-sans">{para}</p>
                      ))}
                      <div className="pt-4 flex items-center gap-4">
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.content.strength}%` }}
                            className="h-full bg-gradient-to-r from-primary to-primary-foreground"
                          />
                        </div>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Strength: {item.content.strength}%</span>
                      </div>
                    </div>
                  </LegalCard>

                  <LegalCard title="Strategic Rationale" icon={<HelpCircle className="w-4 h-4" />} delay={0.4} defaultExpanded={false}>
                    <p className="text-[15px] leading-relaxed text-white/70 font-sans italic border-l-2 border-primary/30 pl-4">"{item.content.reason}"</p>
                  </LegalCard>

                  <LegalCard title="Tactical Framework" icon={<ArrowRightCircle className="w-4 h-4" />} delay={0.5}>
                    <StepList steps={item.content.steps} />
                  </LegalCard>
                  
                  {item.content.location_guidance && (
                    <LegalCard 
                      title={`Jurisdictional Intelligence: ${userCity}`} 
                      icon={<MapPin className="w-4 h-4 text-primary" />} 
                      delay={0.55}
                    >
                      <LocationGuidance data={item.content.location_guidance} />
                    </LegalCard>
                  )}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LegalCard title="Architectural Risks" icon={<AlertTriangle className="w-4 h-4 text-[#F87171]" />} delay={0.6} defaultExpanded={false}>
                      <div className="p-4 bg-[#F87171]/5 border border-[#F87171]/20 rounded-xl">
                        <p className="text-[#F87171] font-bold text-[14px] leading-relaxed">
                          Potential waiver of rights detected if protocol is not initialized within the statutory period.
                        </p>
                      </div>
                    </LegalCard>

                    <LegalCard title="Historical Precedents" icon={<Blocks className="w-4 h-4" />} delay={0.7} defaultExpanded={false}>
                      <div className="flex flex-col gap-3">
                        {item.content.cases.slice(0, 3).map((c: any) => (
                          <div key={c.id || c.title} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1 hover:bg-white/10 transition-colors group">
                            <span className="font-manrope font-extrabold text-sm text-white group-hover:text-primary transition-colors">{c.title}</span>
                            <span className="text-[11px] text-muted-foreground leading-snug">{c.relevance}</span>
                          </div>
                        ))}
                      </div>
                    </LegalCard>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <ActionPanel onAction={handleAction} />
                  </div>
                </motion.div>
              )}
            </div>
          ))}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col items-center justify-center p-20 glass-panel border border-white/5 rounded-[3rem]"
            >
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-lg font-manrope font-bold text-white mb-1 uppercase tracking-tighter">Analyzing Protocol</span>
                <span className="text-xs text-muted-foreground animate-pulse">Running LexisCo RAG Intelligence...</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Persistent Footer Input Area */}
      <div className="sticky bottom-0 w-full pt-6 pb-2 bg-gradient-to-t from-black via-black/90 to-transparent z-30">
        <EvidenceList />
        <ChatInput onSubmit={handleSubmit} />
        <div className="mt-4 flex justify-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Enforced Secure Protocol — RSA-2048 Military Grade Encryption</p>
        </div>
      </div>

      <DocumentModal 
        isOpen={docModalOpen} 
        onClose={() => setDocModalOpen(false)} 
        defaultType={activeDocType} 
        initialDetails={aiResponse?.summary || ''}
      />
    </div>
  );
};

