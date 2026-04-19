import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GenerativeArtScene } from '../components/ui/anomalous-matter-hero';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#000000] text-foreground font-sans antialiased min-h-screen flex flex-col selection:bg-secondary selection:text-secondary-foreground">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-20 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center">
            <span className="text-2xl font-manrope font-extrabold tracking-tighter text-white transition-all duration-300 group-hover:tracking-tight">
              Lexis<span className="text-primary font-medium opacity-80 group-hover:opacity-100 transition-opacity">Co</span>
            </span>
          </Link>
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
          {/* 3D Generative Background Section */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
            <React.Suspense fallback={<div className="w-full h-full bg-black" />}>
              <GenerativeArtScene />
            </React.Suspense>
            {/* Soft overlay gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90" />
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

        {/* Testimonials Section */}
        <section className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-16 text-center flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary mb-6 shadow-sm"
            >
              Protocol Feedback
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-manrope font-bold text-white tracking-tight mb-4">What our users say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">See what our customers have to say about us and how LexisCo has empowered them to take legal action.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              [
                { name: 'Saman Malik', role: 'Customer Support Lead', content: "LexisCo's guidance on drafting an FIR was incredibly helpful. It translated the complex legal terms into plain English, ensuring I understood every step of the process.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzhfqwsi7nb4LIn0RZZOvS-oNQtPSAaX9tx5qNuj1kdQpUKVNntTrxgfvvNduqf20skopBABXfYgmzI6AiU3S_7NKhmc2IzjGtzxe8g27vfJL-WJMd4kTI2T4pUMuvzV7v3uzSlieGH0lerrmIFdKs_h57CBidHPvsPfqMEDNu8OvEi6YL-XYibFvIM8HUezmBrCN_uQdSzdJRihGgjr_FW7SPkogq-b3R7E7YrnwDaH31q-t0DdTuCgzvQ0HH9tUQxirI5kXW-jU" },
                { name: 'Briana Patton', role: 'Operations Manager', content: "This platform revolutionized how we handle consumer complaints. The step-by-step breakdown and auto-generated notices saved us so much time and legal fees.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_rTuvFIGdLFny9dDqUPegBbEjNU9gT1aN1sSrSABQ4d-KUl0y4-Dw_8SB0KvwqtgGu-AJ4pHx9a5hRcHqQ0zN467ImGCH1IbX1uBZP98rfV4lIWYaRsVeOYuDiN2nSZjQoFw9CyzFEPy7HuVrSqco5TZSJBgH1RrsVVnpJ7Wpxngu4TLY4rnv4nFYY1pSV1lJPlDXEfroiAwDhrBw2mvgTFZvRRpJ1f9bBTHj7WEguRaTLq0eiJHw9xbSzxGZbhOvhKZXLUPP2uE" }
              ],
              [
                { name: 'Aliza Khan', role: 'Business Analyst', content: "The smooth implementation exceeded expectations. It streamlined our approach to legal processes, improving our overall response times.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuATV_8ZGbRVy6mXS1YDt_3JnoRxdowHIWERkeRYObjroH2hBeRhMJUjGKCfsYbq4jcQ-1bwAw56_tce7Ik7_lLKTDdX37ySgL-cZl3rSn6JTMQC74_4ba0AbQoFk3MuBS6expiUgtlSMMhTDZw4Xy5DxvWA7xsH9Y96LBxhIESSXuVpE5whmemmarZTNOYzP7BLq5CSiaQ-Og5Oxo7IxpzFSKt3ZitBDW8I_mnmkSsTxn8O2IVx-YMEnmCACzCXlMSgn3YypQ6XaVg" },
                { name: 'Omar Raza', role: 'CEO', content: "LexisCo's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5fn_nnpUYTPUnWM27eF8GzslVaSD71M3gBs9r85QJgjzHYpzU71eVeZYLvK2KmyH5JKw8KbEhVjhlRXxMYfFt7Mj05Q2k9EWabHEthBftqExekW64RQEwyh3usF8tFw2kWT2PPMK7IVpTmfcl2FunJZ__YLZWX3Fk-UM_xlIsPBwIY1eRmRBRxCdVgb-zmK0SBt_fYHFUqH-QHHSumyFxP2wYD80XlYLdH8qRrwdQJYnLkeJu7a2VNx8lJxS8GhW6A6BPRcJ5I2c" }
              ],
              [
                { name: 'Hassan Ali', role: 'E-commerce Manager', content: "Using this platform, our online presence and compliance significantly improved, boosting our business performance and reducing risks.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV7Gdy9h2yEY3qE-lmDRd_cN9lLBvDVzJbGKAOX7kac5q-Y2Ze9GMPWiPX2vPgfit0ewwSQAio-yxItpC2NrNa5gsNLuXZdqHLljDnCgWi0v5j_wUYbxzi5e-gqqgpiQ_fRdCXSVeJceP8H5Zvi2h9S0U5PaMS546Fyoofiikm6wbFbLbU1h-FLkCOn00IHeWbztE4n2XyFJRzTBFZoDjnBIqyEOnWITyKl1U-g34a5-4UejKdLbrs-CMXitMXCiaIuXUlXwps-ko" },
                { name: 'Farhan Siddiqui', role: 'Marketing Director', content: "Our understanding of our rights improved with a user-friendly design and positive user feedback. The verified citations built absolute trust.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKYSbbCbq_jiOaFnEqQJp4U83kgNGhuWKSJqPRf9uraELYOyoBE10kzL18z0JmGcQuNaFfNeJZ58ek7HoLdzFb6Fpa1pdiF9lEt6UZmL4F64lAd5oLAwq2eWxbzQT0d1Lzp1Xh-rQyJnMYmDPL_63GwNeA5ivs_W2ilpdgVJo42N1TmKc70HXmqiLXAZqiZySjRXtbXLARqaSLEl1AIStxPwce9zR6WkZR2Pq6zYW8Ta30q-ESQaMzoUrotSom0F17mCuPxxhNVpY" }
              ]
            ].map((col, colIdx) => (
              <div key={colIdx} className={`flex flex-col gap-6 ${colIdx === 1 ? 'md:mt-12' : colIdx === 2 ? 'md:mt-24' : ''}`}>
                {col.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (colIdx * 2 + idx) * 0.1 }}
                    className="p-8 rounded-2xl bg-card border border-border hover:bg-popover transition-colors duration-300 shadow-xl"
                  >
                    <p className="text-muted-foreground leading-relaxed mb-6 font-sans italic text-sm">"{item.content}"</p>
                    <div className="flex items-center gap-4">
                      <img alt={item.name} className="w-10 h-10 rounded-full object-cover border border-white/10" src={item.img} />
                      <div>
                        <h4 className="font-manrope font-bold text-white text-sm">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
            <Link to="/" className="text-3xl text-white font-manrope font-extrabold leading-none tracking-tighter hover:opacity-80 transition-opacity">LexisCo</Link>
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
