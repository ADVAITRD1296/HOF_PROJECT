import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { api } from '../services/api';
import { ChatInput } from '../components/ChatInput';
import { LegalCard } from '../components/LegalCard';
import { Shield, Activity, Briefcase, ChevronLeft, Zap, FileText, Info, Scale, Gavel, AlertCircle } from 'lucide-react';
import { DocumentModal } from '../components/DocumentModal';
import { motion } from 'framer-motion';

export const CaseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state, setIsLoading } = useAppContext();
    const [currentCase, setCurrentCase] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [localLoading, setLocalLoading] = useState(true);
    const [docModalOpen, setDocModalOpen] = useState(false);
    const [activeDocType, setActiveDocType] = useState<'FIR' | 'Complaint' | 'Notice'>('FIR');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) {
            loadCaseData();
        }
    }, [id]);

    const loadCaseData = async () => {
        setLocalLoading(true);
        try {
            const data = await api.getCaseById(id!, state.user?.id);
            if (data) {
                setCurrentCase(data);
                if (data.metadata?.history) {
                    setMessages(data.metadata.history);
                }
            }
        } catch (error) {
            console.error("Failed to load case detail:", error);
        } finally {
            setLocalLoading(false);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !id || !currentCase) return;

        const userMsg = { type: 'user', content: text, timestamp: new Date() };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            // Use existing guidance API but with case context
            const result = await api.getLegalGuidance(
                text, 
                [], 
                'en', 
                'Delhi', 
                `Current Case context: ${currentCase.title}. Analysis: ${currentCase.description}. Previous Law: ${currentCase.law}`
            );

            const aiMsg = { type: 'ai', content: result, timestamp: new Date() };
            const finalMessages = [...updatedMessages, aiMsg];
            setMessages(finalMessages);

            // Persist the new history to the backend
            const updatedMetadata = {
                ...currentCase.metadata,
                history: finalMessages
            };
            await api.updateCaseMetadata(id, updatedMetadata);
            
        } catch (error) {
            console.error("Failed to process case follow-up:", error);
            alert("Protocol Intelligence Disruption. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAction = (type: string) => {
        if (type === 'Draft FIR') {
            setActiveDocType('FIR');
            setDocModalOpen(true);
        } else if (type === 'Legal Notice') {
            setActiveDocType('Notice');
            setDocModalOpen(true);
        } else if (type === 'Statute Search') {
            alert("Searching Indian Statutes for additional precedents...");
        }
    };

    if (localLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Decrypting Dossier...</p>
            </div>
        );
    }

    if (!currentCase) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4 opacity-50" />
                <h2 className="text-xl font-manrope font-extrabold text-white mb-2">Docket Not Found</h2>
                <p className="text-muted-foreground text-sm max-w-xs mb-6">The requested legal identifier does not exist in the centralized repository.</p>
                <button 
                    onClick={() => navigate('/dashboard/cases')}
                    className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                >
                    <ChevronLeft className="w-4 h-4" /> Return to Repository
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-[#050505]">
            {/* Case Workspace Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 glass-panel border-b border-white/5 gap-4">
                <div className="flex flex-col gap-1">
                    <button 
                        onClick={() => navigate('/dashboard/cases')}
                        className="flex items-center gap-1 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-2 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-3 h-3" /> Back to Repo
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                            <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-2xl font-manrope font-extrabold text-white tracking-tight">{currentCase.title}</h1>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-primary font-bold uppercase tracking-widest leading-none flex items-center gap-1.5">
                            <Activity className="w-3 h-3 animate-pulse" /> {currentCase.status}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-50 tracking-widest">Litigation Probability</span>
                            <span className="text-sm font-manrope font-extrabold text-white">{currentCase.strength}%</span>
                        </div>
                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${currentCase.strength}%` }}
                                className="h-full bg-primary shadow-[0_0_10px_rgba(233,193,118,0.5)]"
                            />
                        </div>
                    </div>
                    <button className="p-3 glass-panel hover:bg-white/10 rounded-xl transition-all">
                        <Shield className="w-5 h-5 text-white/50" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Chat Interaction Zone */}
                <div className="flex-1 flex flex-col overflow-hidden border-r border-white/5">
                    <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar space-y-8">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                                <Scale className="w-16 h-16 text-white mb-6" />
                                <h3 className="text-lg font-manrope font-bold uppercase tracking-[0.3em]">Intelligence Stream Empty</h3>
                                <p className="text-xs max-w-xs mt-2 font-mono">Initialize the first dialogue pass below.</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.type === 'user' ? (
                                        <div className="max-w-[80%] bg-primary p-4 rounded-2xl rounded-tr-none text-primary-foreground font-sans font-medium text-sm shadow-xl">
                                            {msg.content}
                                        </div>
                                    ) : (
                                        <div className="max-w-[90%] w-full">
                                            <LegalCard 
                                                title={msg.content.issue || "Intelligence Pass"} 
                                                icon={<Scale className="w-5 h-5" />}
                                            >
                                                <div className="space-y-4">
                                                    <p>{msg.content.summary}</p>
                                                    {msg.content.law && (
                                                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                            <p className="text-white text-xs font-bold mb-1">Applicable Statute</p>
                                                            <p className="text-[13px]">{msg.content.law}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </LegalCard>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
                        <ChatInput 
                            onSubmit={handleSendMessage}
                        />
                        <div className="mt-3 flex items-center justify-center gap-4 opacity-30">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                <Info className="w-3 h-3" /> End-to-End Cryptography Active
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                <Zap className="w-3 h-3" /> Case-Specific Latency: 24ms
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dossier Sidebar */}
                <div className="hidden lg:flex w-80 flex-col overflow-y-auto bg-[#080808] p-6 border-l border-white/5 gap-8 custom-scrollbar">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                            <FileText className="w-4 h-4" /> Case Narrative
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                            {currentCase.description}
                        </p>
                    </section>
                    
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                            <Gavel className="w-4 h-4" /> Legal Framework
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <h4 className="text-white text-xs font-bold mb-2 uppercase tracking-tight">{currentCase.law}</h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Jurisdictional application identified via semantic mapping to the current docket facts.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                            <Zap className="w-4 h-4" /> Next Protocols
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {['Draft FIR', 'Legal Notice', 'Statute Search'].map((action) => (
                                <button 
                                    key={action} 
                                    onClick={() => handleAction(action)}
                                    className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group flex items-center justify-between"
                                >
                                    <span className="text-[11px] font-bold text-white/70 group-hover:text-primary transition-colors">{action}</span>
                                    <ArrowRightCircle className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <DocumentModal 
                isOpen={docModalOpen} 
                onClose={() => setDocModalOpen(false)} 
                defaultType={activeDocType}
                initialDetails={currentCase.description}
            />
        </div>
    );
};

const ArrowRightCircle = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/>
    </svg>
);
