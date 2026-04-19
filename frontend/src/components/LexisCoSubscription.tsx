import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const LexisCoSubscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('Partner');

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* TopAppBar */}
      <nav className="bg-[#131313]/80 backdrop-blur-xl docked full-width top-0 z-50 shadow-[0px_20px_50px_rgba(0,0,0,0.4)] flex justify-between items-center px-8 h-20 w-full fixed border-b border-white/5">
        <Link to="/" className="text-2xl font-semibold tracking-tighter text-neutral-300 font-headline hover:opacity-80 transition-opacity">
          LexisCo
        </Link>
        <div className="hidden md:flex gap-8 items-center font-manrope tracking-tight text-sm uppercase tracking-[0.1em]">
          <Link to="/mentor" className="text-neutral-500 hover:text-neutral-300 transition-colors">Intelligence</Link>
          <Link to="/dashboard" className="text-neutral-500 hover:text-neutral-300 transition-colors">Chambers</Link>
          <span className="text-[#e9c176] font-bold border-b-2 border-[#e9c176] pb-1">Subscription</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-300">
          <Link to="/dashboard" className="h-10 w-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/15">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl-ofFfrfKdI-KbO84b2k6BBHvqFlqiNdWz86JBoXM9jT-vSY6cIyI07huxcYrGeiHkNfndb5fQ9g_87iCLSj149m9ngrdab_LVTmWMRsLkcO_BNqiDUH1RevDyAhVKJxvLlRaN7G3HBk3YY21rROjd6aEbFk68tlbTJOpnVsL2dtgDsDCtHFWwX1p9n9QWkIoDfqpAtupN9NHexblXa_X6LHWs5iloONkUQ8znOjzJIQKdRQ7FCKPvaUEYObabBYbOXOLx5wUkWQ"/>
          </Link>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Header */}
        <header className="text-center mb-20 max-w-3xl">
          <h1 className="font-headline text-5xl md:text-6xl text-primary font-bold tracking-tight mb-6">Invest in Your Practice</h1>
          <p className="text-on-surface-variant text-lg md:text-xl font-body leading-relaxed max-w-2xl mx-auto opacity-70">
            Elevate your legal research with unparalleled precision. Choose the tier that aligns with your practice's ambition.
          </p>
        </header>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
          {/* Card 1: Associate */}
          <div 
            onClick={() => setSelectedPlan('Associate')}
            className={`glass-panel cursor-pointer rounded-[32px] p-8 flex flex-col h-full border transition-all duration-300 ${selectedPlan === 'Associate' ? 'border-primary scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'border-outline-variant/15 opacity-80'}`}
          >
            <div className="mb-8">
              <h3 className="font-headline text-2xl mb-2 font-semibold">Associate</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold">Free</span>
              </div>
              <p className="text-on-surface-variant text-xs mt-4 font-label tracking-wide opacity-60">For foundational research and students.</p>
            </div>
            <ul className="flex-grow space-y-4 mb-12">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <span className="text-on-surface-variant text-sm">Access to public case law</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <span className="text-on-surface-variant text-sm">Basic semantic search</span>
              </li>
              <li className="flex items-start gap-3 opacity-30">
                <span className="material-symbols-outlined text-outline text-sm mt-1">lock</span>
                <span className="text-on-surface-variant text-sm">No predictive analytics</span>
              </li>
            </ul>
            <Link to="/mentor" className="w-full">
              <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                Get Started
              </button>
            </Link>
          </div>

          {/* Card 2: Partner */}
          <div 
            onClick={() => setSelectedPlan('Partner')}
            className={`glass-panel cursor-pointer rounded-[32px] p-8 flex flex-col h-full border transition-all duration-300 relative ${selectedPlan === 'Partner' ? 'border-secondary scale-105 shadow-[0_0_40px_rgba(171,200,245,0.15)] bg-surface-container-high/40' : 'border-outline-variant/15 opacity-80'}`}
          >
            <div className="mb-8">
              <h3 className="font-headline text-2xl mb-2 font-semibold text-secondary">Partner</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold">₹199</span>
                <span className="text-on-surface-variant text-sm opacity-60">/month</span>
              </div>
              <p className="text-on-surface-variant text-xs mt-4 font-label tracking-wide opacity-60">For established practices requiring depth.</p>
            </div>
            <ul className="flex-grow space-y-4 mb-12">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-1" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <span className="text-on-surface-variant text-sm">Full Supreme Court archives</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-1" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <span className="text-on-surface-variant text-sm">AI-driven precedent mapping</span>
              </li>
            </ul>
            <Link to="/mentor" className="w-full">
               <button className="w-full py-4 rounded-xl bg-secondary/20 border border-secondary/30 text-secondary font-bold hover:bg-secondary/30 transition-colors">
                  Upgrade Now
               </button>
            </Link>
          </div>

          {/* Card 3: Sovereign */}
          <div 
            onClick={() => setSelectedPlan('Sovereign')}
            className={`glass-panel cursor-pointer rounded-[32px] p-8 flex flex-col h-full border transition-all duration-300 relative ${selectedPlan === 'Sovereign' ? 'border-tertiary scale-105 shadow-[0_0_50px_rgba(233,193,118,0.2)] bg-surface-container-high/60' : 'border-outline-variant/15 opacity-80'}`}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-tertiary text-on-tertiary text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
              Recommended
            </div>
            <div className="mb-8">
              <h3 className="font-headline text-2xl mb-2 flex items-center gap-2 font-semibold text-tertiary">
                Sovereign
                <span className="material-symbols-outlined" style={{fontSize: "20px", fontVariationSettings: "'FILL' 1"}}>local_police</span>
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold">₹699</span>
                <span className="text-on-surface-variant text-sm opacity-60">/month</span>
              </div>
              <p className="text-on-surface-variant text-xs mt-4 font-label tracking-wide opacity-60">Ultimate arsenal for legal dominance.</p>
            </div>
            <ul className="flex-grow space-y-4 mb-12">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary text-sm mt-1" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <span className="text-on-surface text-sm">Predictive litigation analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary text-sm mt-1" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <span className="text-on-surface text-sm">Automated brief drafting</span>
              </li>
            </ul>
            <Link to="/mentor" className="w-full">
               <button className="w-full py-4 rounded-xl bg-tertiary text-on-tertiary font-bold hover:opacity-90 transition-opacity">
                  Claim Authority
               </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-white/5 py-12 px-8 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold tracking-tighter text-neutral-600 font-headline">LexisCo</div>
          <div className="flex gap-6 text-[10px] text-neutral-500 font-label tracking-[0.2em] uppercase">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/feedback" className="hover:text-primary transition-colors">Feedback</Link>
            <a className="hover:text-primary transition-colors" href="#">Ethics</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
