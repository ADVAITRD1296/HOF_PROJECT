import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const LexisCoCreateAccount: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful registration
    navigate('/dashboard');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative w-full overflow-hidden py-12 bg-black" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvcy8guUhwabn2-cNw03C3WkpwME_e5aK_K8fl8HfLI5n67o-0itBvlVIvMJWzI3Q2E3tNmok6yGQuyGjFJOXGqB8vVA80flG2mLrQgQFOjE9Yg_0CtqlR4XQBNR847ovhUHVP8rsaPEk8Yso9XHlRsZHs2f6SuzfCyBj1fJ8YSafdMJZ9wU8UKzjGwNR_FhZGsxFFu9ibKgpLI3VUizc3gzb0AbkVKlrMvdrtPH7Cuo-_90xJmQpaCcMoqnCTQL4MzJz9-tDBMN4')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 w-full max-w-md mx-auto p-12 liquid-glass rounded-[2rem] border border-white/10 shadow-ambient flex flex-col items-center">
        <div className="mb-10 flex flex-col items-center gap-4 w-full text-center">
          <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-4xl text-primary font-light" style={{fontVariationSettings: "'FILL' 1"}}>account_balance</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-secondary">LexisCo</h1>
          <p className="font-body text-[10px] text-primary/40 tracking-[0.2em] uppercase">Authority through Intelligence</p>
        </div>

        <h2 className="font-headline text-2xl font-bold text-white tracking-tight mb-8">Create Your Account</h2>

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-5">
           <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-primary/40 font-bold ml-1">Full Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">person</span>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm py-4 pl-12 pr-4 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all" 
                placeholder="Enter full name" 
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-primary/40 font-bold ml-1">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">mail</span>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm py-4 pl-12 pr-4 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all" 
                placeholder="scholar@lexisco.com" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-primary/40 font-bold ml-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">lock</span>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm py-4 pl-12 pr-4 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all" 
                placeholder="••••••••" 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-secondary text-black font-headline font-bold text-sm py-4 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(171,200,245,0.2)]">
            Establish Authority
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </form>

        <div className="mt-10 text-center w-full">
          <p className="font-body text-xs text-primary/50">
            Already have an account? 
            <Link to="/login" className="text-tertiary font-bold hover:opacity-80 transition-opacity ml-1">Sign In</Link>
          </p>
        </div>
      </div>
      
      <p className="text-center mt-8 font-label text-[9px] uppercase tracking-[0.3em] text-primary/20 relative z-10 pb-8 underline-offset-4 underline decoration-white/5">
        Confidential & Proprietary Protocol
      </p>
    </main>
  );
};
