import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLegalGuidance } from '../services/api';
import { ComplaintFIRGenerator } from './ComplaintFIRGenerator';
import type { LegalGuidanceResponse } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  steps?: { title: string; description: string }[];
  laws?: { title: string; citation: string; description: string; color: string }[];
  data?: LegalGuidanceResponse;
}

export const LexisCoAdvancedAIMentorInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I understand the situation. Unauthorized charges by telecom operators constitute a deficiency in service under the Consumer Protection Act, 2019. Let's structure a robust action plan.",
      timestamp: '10:42 AM',
      steps: [
        { title: 'Gather Empirical Evidence', description: 'Compile all billing statements, emails, and SMS records showing the unauthorized deductions.' },
        { title: 'Appellate Authority Escalation', description: 'We must demonstrate exhaustion of internal remedies. I will draft an advocacy email to the Nodal Officer.' }
      ],
      laws: [
        { title: 'Section 2(11) - Deficiency', citation: 'CPA, 2019', description: 'Defines fault or shortcoming in service quality.', color: 'secondary' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatTitle, setChatTitle] = useState('Consumer Rights Matter');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!inputValue.trim() || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await fetchLegalGuidance(inputValue, language === 'EN' ? 'en' : 'hi');
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.ai_response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        steps: response.steps?.map(s => ({ title: s.title, description: s.explanation })),
        laws: response.applicable_laws?.map(l => ({ title: l.title, citation: `${l.act} • Section ${l.section}`, description: l.explanation, color: 'secondary' }))
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error fetching guidance:", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <nav className="bg-black/40 backdrop-blur-xl border-b border-white/10 docked full-width top-0 z-50 sticky font-headline tracking-tight">
        <div className="flex justify-between items-center px-8 py-4 w-full">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
            LexisCo
          </Link>
          <div className="hidden md:flex space-x-8">
            <a className="text-gray-400 hover:text-white transition-colors duration-300 font-semibold py-1 text-sm tracking-wide" href="#">Research</a>
            <a className="text-gray-400 hover:text-white transition-colors duration-300 font-semibold py-1 text-sm tracking-wide" href="#">Drafting</a>
            <a className="text-[#e9c176] font-semibold border-b-2 border-[#e9c176] pb-1 text-sm tracking-wide" href="#">Analysis</a>
            <a className="text-gray-400 hover:text-white transition-colors duration-300 font-semibold py-1 text-sm tracking-wide" href="#">Library</a>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className={`w-12 h-6 bg-white/20 rounded-full relative transition-all duration-300 ${language === 'HI' ? 'bg-secondary/40' : ''}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300 ${language === 'HI' ? 'left-7' : 'left-1'}`}></div>
              </div>
              <span className="font-headline font-semibold text-[11px] text-white tracking-widest uppercase">{language}</span>
            </button>
            <Link to="/subscription" className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-full">
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link to="/dashboard" className="h-8 w-8 rounded-full bg-surface-container-high overflow-hidden border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <img alt="User Portrait" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe5Pg_CYp0aC3byUiCfgIVHGYqSaHENIL3ywjtIfKbKBWek9LsGVYYeGnR31aSN7wuUIaGJsU4V5a5eusEWUv_173blDVKDqTg2jmN7xzTyh0arWtsxSQ3y33InhszK2xtNLaqAR28R7Xtpht8yOFO3mLwNhw-ZcApb4vCmAyihQJJCYxxqskVoIuYuvKZWrxgHgHKfLJPNos8uuazqbMKCuq66RxklVQmONDJA9IACV5meUsLHnW_IKYkzf4NWSm2b9GzaMg0enQ"/>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        <aside className="hidden md:flex liquid-glass border-r border-white/10 h-full w-64 flex-col z-40 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-50"></div>
          <div className="p-6 pb-2 relative z-10">
            <button 
              onClick={() => setMessages([])}
              className="w-full py-3 px-6 rounded-full liquid-glass border border-white/20 text-white font-headline font-semibold text-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>New Legal Inquiry</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 font-headline text-sm tracking-wide relative z-10">
            <div className="px-6 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Navigation</div>
            <Link to="/mentor" className="bg-white/10 text-[#e9c176] px-4 py-3 border-l-4 border-[#e9c176] flex items-center space-x-3">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              <span>Intelligence</span>
            </Link>
            <Link to="/dashboard" className="text-gray-400 px-6 py-3 flex items-center space-x-3 hover:text-white hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
              <span>Active Projects</span>
            </Link>
            <div className="mt-6">
              <div className="px-6 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">History</div>
              <div className="space-y-1">
                <div className="group flex items-center justify-between px-6 py-2 hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-transparent hover:border-[#e9c176]">
                  <div className="flex flex-col truncate">
                    <span className="text-white text-xs font-medium truncate">{chatTitle}</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">10:42 AM</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsEditingTitle(true)} className="text-gray-500 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[14px]">share</span>
                    </button>
                  </div>
                </div>
                <div className="group flex items-center justify-between px-6 py-2 hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-transparent hover:border-white/30">
                  <div className="flex flex-col truncate">
                    <span className="text-gray-400 group-hover:text-white text-xs font-medium truncate transition-colors">Property Dispute Mumbai</span>
                    <span className="text-[9px] text-gray-600 uppercase tracking-widest mt-0.5">2 Days Ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 flex flex-col relative bg-transparent overflow-hidden">
          <header className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md z-10 sticky top-0">
            <div className="flex flex-col">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input 
                    autoFocus
                    className="bg-white/10 border-none text-white font-headline text-2xl font-bold py-0 h-8 rounded focus:ring-1 focus:ring-secondary/50 outline-none"
                    value={chatTitle}
                    onChange={(e) => setChatTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 group">
                  <h1 className="font-headline text-2xl font-bold text-white tracking-tight">{chatTitle}</h1>
                  <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              )}
              <p className="font-label text-[10px] text-gray-500 mt-1 tracking-[0.15em] uppercase">AI Counsel Session \ ID: #LC-992A</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all">
                 <span className="material-symbols-outlined" style={{fontSize: "20px"}}>share</span>
              </button>
              <span className="px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold tracking-widest uppercase flex items-center shadow-[0_0_15px_rgba(171,200,245,0.1)]">
                <span className="material-symbols-outlined text-[14px] mr-1" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span> 
                Sovereign Mode
              </span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth relative z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent opacity-30 pointer-events-none"></div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full relative z-10 ${msg.role === 'user' ? 'justify-end' : 'justify-start group'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center mr-4 shrink-0 shadow-[0_0_20px_rgba(171,200,245,0.15)] relative overflow-hidden">
                    <span className="material-symbols-outlined text-secondary relative z-10">account_balance</span>
                  </div>
                )}
                <div className={`${msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[80%]'} relative`}>
                  {msg.role === 'assistant' && <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-transparent rounded-2xl blur opacity-30 pointer-events-none"></div>}
                  <div className={`liquid-glass p-6 ${msg.role === 'user' ? 'rounded-2xl rounded-tr-sm bg-white/5' : 'rounded-2xl rounded-tl-sm'}`}>
                    <p className="font-body text-white leading-relaxed text-sm">{msg.content}</p>
                    
                    {msg.steps && (
                      <div className="space-y-4 mt-8">
                        {msg.steps.map((step, idx) => (
                          <div key={idx} className="liquid-glass rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors group/card">
                            <div className="flex items-center mb-3">
                              <span className="text-tertiary font-headline font-extrabold mr-3 text-[10px] uppercase tracking-[0.2em]">Step {String(idx + 1).padStart(2, '0')}</span>
                              <h3 className="font-headline text-white font-semibold text-sm">{step.title}</h3>
                            </div>
                            <p className="text-sm text-gray-400 font-body leading-relaxed">{step.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.laws && (
                      <div className="mt-8">
                        <h4 className="font-headline text-xs font-bold text-white tracking-widest uppercase mb-4 flex items-center">
                          <span className="material-symbols-outlined text-sm mr-2 text-secondary">library_books</span> Verified Citations
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {msg.laws.map((law, idx) => (
                            <div key={idx} className="p-4 rounded-xl liquid-glass relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-secondary/60"></div>
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-label text-[9px] text-secondary tracking-widest uppercase">{law.citation}</p>
                              </div>
                              <p className="font-headline text-xs text-white font-semibold mb-1">{law.title}</p>
                              <p className="text-[11px] text-gray-400 font-body">{law.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {showGenerator && msg.role === 'assistant' && (
                      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ComplaintFIRGenerator />
                      </div>
                    )}

                    {msg.role === 'assistant' && (
                      <div className="mt-8 flex items-center gap-3">
                        <button className="px-5 py-2.5 rounded-lg border border-white/20 text-[10px] font-bold tracking-widest uppercase text-white hover:bg-white/10 transition-all flex items-center">
                          <span className="material-symbols-outlined text-[16px] mr-2">content_copy</span> 
                          Copy Strategy
                        </button>
                        <button 
                          onClick={() => setShowGenerator(true)}
                          className="px-5 py-2.5 rounded-lg bg-white/10 border border-secondary/30 text-[10px] font-bold tracking-widest uppercase text-white hover:bg-white/20 transition-all flex items-center shadow-[0_0_15px_rgba(171,200,245,0.05)]"
                        >
                          <span className="material-symbols-outlined text-[16px] mr-2 text-secondary">edit_document</span> 
                          {showGenerator ? 'Refining Draft...' : 'Generate Legal Notice'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start w-full opacity-60 relative z-10">
                <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center mr-4 shrink-0">
                  <span className="material-symbols-outlined text-gray-400 animate-spin">hourglass_empty</span>
                </div>
                <div className="liquid-glass rounded-2xl rounded-tl-sm py-3 px-6 flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse delay-75"></span>
                  <span className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse delay-150"></span>
                  <span className="text-xs font-label text-gray-400 ml-2 tracking-wide">Analyzing Legal Frameworks...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-8 bg-black z-10">
            <div className="max-w-4xl mx-auto relative">
              <div className="relative flex items-center liquid-glass rounded-full p-2 border border-white/10">
                <button className="p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-transparent border-none text-white placeholder:text-gray-500 focus:ring-0 font-body text-sm px-4" 
                  placeholder="Ask any legal question (e.g., 'What are my rights in a rent dispute?')..." 
                  type="text"
                />
                <button 
                  onClick={handleSend}
                  disabled={isThinking}
                  className="p-3 bg-secondary/20 text-secondary rounded-full hover:bg-secondary/30 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
              <p className="text-center mt-4 text-[9px] font-label text-gray-600 tracking-widest uppercase">
                LexisCo provided guidance is for educational purposes and not professional legal advice.
              </p>
            </div>
          </div>
        </section>

        {/* Right Contextual Panel (Hidden on smaller hubs) */}
        <aside className="hidden xl:flex w-80 liquid-glass border-l border-white/10 p-8 flex-col gap-10 overflow-y-auto">
           <div>
              <h4 className="font-headline text-xs font-bold text-white tracking-widest uppercase mb-6 flex items-center">
                <span className="material-symbols-outlined text-[16px] mr-2 text-tertiary">bolt</span> Smart Suggestions
              </h4>
              <div className="space-y-3">
                <button className="w-full text-left p-5 rounded-2xl liquid-glass border border-white/5 hover:bg-white/10 transition-all transition-all group">
                  <p className="text-xs text-white group-hover:text-secondary transition-colors font-medium">Generate Complaint Draft</p>
                  <p className="text-[9px] text-gray-500 mt-1 font-body">Compliant with Consumer Act 2019</p>
                </button>
                <button className="w-full text-left p-5 rounded-2xl liquid-glass border border-white/5 hover:bg-white/10 transition-all transition-all group">
                  <p className="text-xs text-white group-hover:text-secondary transition-colors font-medium">Find Legal Aid Near Me</p>
                  <p className="text-[9px] text-gray-500 mt-1 font-body">Pro-bono services lookup</p>
                </button>
              </div>
           </div>
           <div>
              <h4 className="font-headline text-xs font-bold text-white tracking-widest uppercase mb-6 flex items-center">
                <span className="material-symbols-outlined text-[16px] mr-2 text-secondary">update</span> History Ledger
              </h4>
              <div className="space-y-4 opacity-50">
                 <div className="text-[10px] text-gray-500 italic">No recent history in this session.</div>
              </div>
           </div>
        </aside>
      </main>
    </div>
  );
};
