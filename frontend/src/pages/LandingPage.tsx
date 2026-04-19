import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#000000] text-foreground font-sans antialiased min-h-screen flex flex-col selection:bg-secondary selection:text-secondary-foreground">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-20 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-widest text-primary uppercase font-manrope">LexisCo</span>
        </div>
        <div className="hidden md:flex gap-8">
          <Link className="text-muted-foreground font-manrope tracking-tight hover:text-white transition-colors duration-300" to="/features">Features</Link>
          <Link className="text-muted-foreground font-manrope tracking-tight hover:text-white transition-colors duration-300" to="/about">Platform</Link>
          <Link className="text-muted-foreground font-manrope tracking-tight hover:text-white transition-colors duration-300" to="/pricing">Access</Link>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Link 
            to="/sign-in" 
            className="hidden md:block font-manrope text-sm tracking-wide text-white bg-white/5 border border-white/20 backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] px-5 py-2 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Sign In
          </Link>
          <Link 
            to="/sign-up" 
            className="font-manrope font-medium text-sm text-white bg-white/5 border border-white/20 backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] px-6 py-2 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Get Started
          </Link>
          <Link 
            to="/lawyer-sign-up" 
            className="hidden lg:block font-manrope font-bold text-xs tracking-widest text-[#e9c176] uppercase border border-[#e9c176]/20 bg-[#e9c176]/5 px-4 py-2 rounded-full hover:bg-[#e9c176]/10 transition-all duration-300"
          >
            Join as Lawyer
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="space-y-32 flex-grow">
        {/* Hero Section */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 pb-24 overflow-hidden bg-black">
          {/* Wireframe Sphere Background Element */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <img 
              alt="abstract sphere" 
              className="w-[700px] h-[700px] object-cover mix-blend-screen opacity-30 grayscale rounded-full blur-[2px]" 
              style={{ maskImage: 'radial-gradient(circle, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)' }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzqMw1h8mf5FU7FzBOnELV-_3ADSG1qA6vEwV7CZonwCTfJ6g7JFGA3xhfxZdGqww41wH9yzleyLcuXNKbQfIXZqRSVfWcWgmHEmOxsfrd9gPfyetiQMHvE_d0bKIpuLbVIcj1Cku3XvuteCQVLNj9zsMgKrIoqYX1O9B_6vTl3fZMaEMVLicLujdxpTyhl_RwGX-jnIbLD2cBk6nNBwyBv4cFNdE-IRtohtzWJZD6-P07EJfPNp88FB0yy5PKU3CGUwRINvweTS4" 
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center z-10 max-w-4xl px-8 flex flex-col items-center mt-32"
          >
            <div className="text-xs font-mono tracking-[0.15em] text-muted-foreground mb-6 uppercase">Launch Sequence: Anomaly 12</div>
            <h1 className="text-5xl md:text-7xl font-manrope font-bold tracking-tight text-white mb-8 leading-[1.1]">
              Not Just Answers, <br/>But Action.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-sans max-w-xl mx-auto leading-relaxed">
              The AI mentor that guides you through India's legal system step-by-step. Complex legal jargon translated into clear, actionable strategy.
            </p>
          </motion.div>
        </section>

        {/* Process Section */}
        <section className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-manrope font-bold text-primary tracking-tight">The LexisCo Process</h2>
            <p className="text-muted-foreground mt-4 text-lg">From complex problem to concrete action.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: '01', icon: 'mic', title: 'Explain Your Situation', desc: 'Speak or type your problem in simple language. We understand the context, not just the keywords.' },
              { id: '02', icon: 'account_balance', title: 'AI Analyzes Law', desc: 'Cross-referencing against IPC, BNS, Consumer Act, and the latest precedents instantly.' },
              { id: '03', icon: 'fact_check', title: 'Clear Breakdown', desc: 'Understand your rights exactly. No legalese, just a transparent strategic overview.' },
              { id: '04', icon: 'description', title: 'Generate Documents', desc: 'Auto-draft actionable FIRs, formal complaints, or legal notices ready for submission.', highlight: true }
            ].map((step) => (
              <div key={step.id} className="p-8 rounded-2xl bg-card border border-border hover:bg-popover transition-colors duration-300 relative group">
                <div className={`absolute -top-4 -left-4 w-12 h-12 bg-black font-manrope font-bold rounded-xl flex items-center justify-center border border-border shadow-xl ${step.highlight ? 'text-[#e9c176]' : 'text-primary'}`}>
                  {step.id}
                </div>
                <span className={`material-symbols-outlined text-4xl mb-6 block font-light ${step.highlight ? 'text-[#e9c176]' : 'text-primary'}`}>{step.icon}</span>
                <h3 className="font-manrope font-bold text-xl text-primary mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center pb-24 px-8 mt-24">
          <h2 className="text-4xl font-manrope font-extrabold text-primary mb-8 tracking-tight">Take the First Step Towards Justice.</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              to="/sign-up"
              className="inline-flex font-manrope font-bold text-lg text-white bg-white/5 border border-white/20 backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] px-10 py-4 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Start Your Case Analysis
            </Link>
            <Link 
              to="/lawyer-sign-up"
              className="inline-flex font-manrope font-bold text-lg text-[#e9c176] bg-[#e9c176]/5 border border-[#e9c176]/20 backdrop-blur-md px-10 py-4 rounded-full hover:bg-[#e9c176]/10 transition-all duration-300"
            >
              Join the Legal Network
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mx-auto px-12 py-16 border-t border-white/5 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none opacity-30"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
          <div className="md:col-span-1 flex flex-col justify-start gap-6">
            <div className="text-3xl text-white font-manrope font-extrabold leading-none tracking-tighter">LexisCo</div>
            <p className="text-muted-foreground text-sm">© 2026 Sovereign Scholar. All rights reserved.</p>
          </div>
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-medium text-sm font-manrope">Product</h4>
            <div className="flex flex-col gap-3">
              <a className="text-muted-foreground hover:text-white transition-colors text-sm" href="#">Features</a>
              <a className="text-muted-foreground hover:text-white transition-colors text-sm" href="#">Pricing</a>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-medium text-sm font-manrope">Company</h4>
            <div className="flex flex-col gap-3">
              <a className="text-muted-foreground hover:text-white transition-colors text-sm" href="#">About Us</a>
              <a className="text-muted-foreground hover:text-white transition-colors text-sm" href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
