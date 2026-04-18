import React from 'react';
import { Link } from 'react-router-dom';

export const LexisCoProfile: React.FC = () => {
  const recentActivities = [
    { id: 1, title: 'Consumer Rights Analysis', type: 'description', time: '14 hours ago', status: 'COMPLETED', color: 'secondary' },
    { id: 2, title: 'FIR Draft - Property Dispute', type: 'edit_document', time: '2 days ago', status: 'IN PROGRESS', color: 'tertiary' },
    { id: 3, title: 'RTI Inquiry - Municipal Corp', type: 'fact_check', time: '5 days ago', status: 'COMPLETED', color: 'primary' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-manrope selection:bg-secondary/30">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col py-8 px-6 gap-6 bg-[#1c1b1b] shadow-[1px_0_0_0_rgba(255,255,255,0.05)] h-screen w-80 fixed left-0 top-0 z-40">
        <div className="flex items-center gap-4 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden flex-shrink-0 border border-white/10">
            <img alt="Legal professional" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpS2hUp4b1Lz82KJGOT1xqlyksh77y0qo1syg9-zBmEiMAY5DhiI4dUeHmJytx36L_4aMUBkntI_kHuBwEFKKJnLd3jvVUZrvXud8VF-ezk7hXTnPPFT9gLVxbxlFGl4AvoG134AFk53WdXo9G2LrUVVZzubFJ7fLpy0P2lGBGIfJPWS-mSadJWIM4Na-d_wZqyDOxBcY1ILL2Gg92XXJdwXpR23PiWEOlnkGwNU1xULXLkTXqNh8B2b3PtiXJcqxO957jhlRfT_k"/>
          </div>
          <div>
            <h1 className="text-[#c6c6c6] font-bold tracking-widest uppercase text-[10px]">Marcus Vance</h1>
            <p className="text-secondary text-[9px] tracking-wide mt-1">Senior Counsel</p>
          </div>
        </div>

        <Link to="/mentor" className="w-full">
          <button className="w-full bg-white/5 border border-white/10 text-primary py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{fontSize: "18px"}}>add</span>
            New Inquiry
          </button>
        </Link>

        <div className="flex-1 flex flex-col gap-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-md text-[#e9c176] font-semibold bg-[#353534]/30 text-sm">
            <span className="material-symbols-outlined" style={{fontSize: "20px"}}>account_circle</span>
            Dashboard
          </Link>
          <Link to="/mentor" className="flex items-center gap-3 px-4 py-3 rounded-md text-[#c6c6c6]/60 hover:text-[#c6c6c6] hover:bg-[#353534]/20 transition-all text-sm">
            <span className="material-symbols-outlined" style={{fontSize: "20px"}}>smart_toy</span>
            Intelligence
          </Link>
          <Link to="/subscription" className="flex items-center gap-3 px-4 py-3 rounded-md text-[#c6c6c6]/60 hover:text-[#c6c6c6] hover:bg-[#353534]/20 transition-all text-sm">
            <span className="material-symbols-outlined" style={{fontSize: "20px"}}>payments</span>
            Subscription
          </Link>
        </div>

        <div className="flex flex-col gap-2 mt-auto border-t border-white/5 pt-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-md text-[#c6c6c6]/60 hover:text-[#c6c6c6] hover:bg-[#353534]/20 transition-all text-sm">
            <span className="material-symbols-outlined" style={{fontSize: "18px"}}>logout</span>
            Log Out
          </Link>
        </div>
      </nav>

      {/* Main Canvas Area */}
      <main className="flex-1 md:ml-80 relative flex flex-col">
        <header className="flex justify-between items-center px-12 h-20 bg-[#131313]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 uppercase tracking-widest text-[9px] font-bold">
          <div className="flex items-center gap-8">
            <span className="text-[#e9c176] border-b border-[#e9c176] py-2">Profile Overview</span>
            <Link to="/subscription" className="text-[#c6c6c6]/50 hover:text-[#abc8f5] transition-colors py-2">Account Tier</Link>
          </div>
          <div className="flex items-center gap-6">
            <button className="px-4 py-1.5 bg-transparent border border-tertiary/30 text-tertiary rounded-full hover:bg-tertiary/10 transition-colors">
              Sovereign Plan
            </button>
          </div>
        </header>

        <div className="flex-1 pt-12 pb-24 px-8 lg:px-16 max-w-7xl mx-auto w-full flex flex-col gap-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-white">Chambers</h2>
            <p className="text-primary/50 text-sm max-w-2xl font-body">Manage your credentials, review access logs, and configure your Sovereign Scholar instance.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Dossier Card */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="liquid-glass rounded-2xl p-8 flex flex-col items-center text-center border border-white/10 shadow-xl bg-white/2">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-secondary/20 p-1">
                   <img alt="Marcus Vance" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVlzsoZaIxFFtxMn7a5XzNBdKqcAdttkX9LEm98lQGYfcqr6at-GWzYHnIwrjbwgM46dbss6plUPlYyL7cL3_j7OOixE6LTZiRO8e3wygfin72kMGW1LLQc0fChe72B1GF7e0B_tmLZ7tosjkEQn8yXXRyeu9_HP5UBku0pmispRnhRmR4503EMsO_gLe20KWn89q4fH3IrOOSiaCZRI5Osdg-NZGzYduheKpKQkhEU7mivnahcDefo4P5ncN3X1QjOYO1mBHrWAo"/>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[9px] font-bold uppercase tracking-widest mb-4">
                  <span className="material-symbols-outlined" style={{fontSize: "12px", fontVariationSettings: "'FILL' 1"}}>verified</span>
                  Sovereign User
                </div>
                <h3 className="text-xl text-white font-bold mb-1">Marcus Vance</h3>
                <p className="text-secondary text-xs mb-4 font-label tracking-wide uppercase">Senior Counsel</p>
                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest">
                  Edit Dossier
                </button>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary/40 mb-6 flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-sm">shield_lock</span>
                  Security State
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-primary/70">2FA Protection</span>
                    <span className="text-green-400 text-[10px] font-bold border border-green-400/20 px-2 py-0.5 rounded">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-primary/70">Access Ledger</span>
                    <span className="text-primary/40 text-[10px]">2 Devices Linked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h4 className="text-lg text-white font-bold mb-6">Inquiry Ledger</h4>
                <div className="flex flex-col gap-4">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="p-5 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-${act.color}/10 flex items-center justify-center text-${act.color}`}>
                          <span className="material-symbols-outlined" style={{fontSize: "20px"}}>{act.type}</span>
                        </div>
                        <div>
                          <h6 className="text-sm text-white group-hover:text-secondary transition-colors font-semibold">{act.title}</h6>
                          <p className="text-[10px] text-primary/40 tracking-wider mt-0.5 uppercase">— {act.time}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-sm text-[9px] font-bold tracking-widest border ${act.status === 'COMPLETED' ? 'text-secondary border-secondary/20 bg-secondary/5' : 'text-tertiary border-tertiary/20 bg-tertiary/5'}`}>
                        {act.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h4 className="text-lg text-white font-bold mb-6">Sovereign Settings</h4>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="max-w-md">
                         <h5 className="text-sm text-white font-semibold mb-1">AI Context Retention</h5>
                         <p className="text-xs text-primary/50 leading-relaxed">Let LexisCo keep context across different inquiries to provide hyper-personalized jurisdictional analysis.</p>
                      </div>
                      <div className="w-12 h-6 bg-secondary/20 rounded-full relative border border-secondary/30">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-secondary rounded-full"></div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button className="flex-1 py-4 border border-white/5 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors">Safety Protocols</button>
                 <button className="flex-1 py-4 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-red-500/5 transition-colors">Terminate Instance</button>
              </div>
            </div>
          </div>
        </div>

        <footer className="w-full mt-auto border-t border-white/5 py-8 px-12 bg-black">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            <p className="text-[9px] tracking-[0.2em] text-primary/30 uppercase">© 2026 LexisCo Legal Action Assistant</p>
            <div className="flex gap-8 text-[9px] tracking-[0.2em] text-primary/30 uppercase">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Data Sovereignity</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
