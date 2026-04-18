import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const LexisCoSignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd call an auth API here.
    // For now, we'll just redirect to the dashboard.
    navigate('/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative w-full overflow-hidden bg-black" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvcy8guUhwabn2-cNw03C3WkpwME_e5aK_K8fl8HfLI5n67o-0itBvlVIvMJWzI3Q2E3tNmok6yGQuyGjFJOXGqB8vVA80flG2mLrQgQFOjE9Yg_0CtqlR4XQBNR847ovhUHVP8rsaPEk8Yso9XHlRsZHs2f6SuzfCyBj1fJ8YSafdMJZ9wU8UKzjGwNR_FhZGsxFFu9ibKgpLI3VUizc3gzb0AbkVKlrMvdrtPH7Cuo-_90xJmQpaCcMoqnCTQL4MzJz9-tDBMN4')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 w-full max-w-md mx-auto p-12 liquid-glass rounded-[2rem] border border-white/10 shadow-ambient flex flex-col items-center">
        <div className="mb-10 flex flex-col items-center gap-4 w-full">
          <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-4xl text-primary font-light" style={{fontVariationSettings: "'FILL' 1"}}>account_balance</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-secondary">LexisCo</h1>
          <p className="font-body text-[10px] text-primary/40 tracking-[0.2em] uppercase">The Sovereign Scholar</p>
        </div>

        <div className="text-center w-full mb-8">
          <h2 className="font-headline text-2xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
          <p className="font-body text-primary/60 text-sm">Access your intelligence dashboard.</p>
        </div>

        <form onSubmit={handleSignIn} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-label text-xs tracking-wider text-primary/40 uppercase">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">mail</span>
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm py-4 pl-12 pr-4 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all placeholder:text-gray-600" 
                placeholder="scholar@lexisco.com" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-label text-xs tracking-wider text-primary/40 uppercase">Password</label>
              <a className="font-label text-[10px] text-secondary hover:text-tertiary transition-colors uppercase tracking-widest" href="#">Forgot?</a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">lock</span>
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm py-4 pl-12 pr-4 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all placeholder:text-gray-600" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-secondary text-black font-headline font-bold text-sm py-4 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(171,200,245,0.2)]">
            Sign In
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
          
          <Link to="/register" className="w-full mt-3">
             <button type="button" className="w-full bg-transparent border border-white/10 text-white font-headline font-bold text-sm py-4 rounded-full hover:bg-white/5 transition-colors">
                Create Account
             </button>
          </Link>
        </form>

        <div className="w-full flex items-center gap-4 my-8">
          <div className="flex-grow h-px bg-white/5"></div>
          <span className="font-label text-[10px] text-primary/30 uppercase tracking-[0.2em]">Or</span>
          <div className="flex-grow h-px bg-white/5"></div>
        </div>

        <button className="w-full bg-white/5 border border-white/10 text-white font-body text-sm py-4 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-3" type="button">
          <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21528 6.86 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"></path>
            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"></path>
            <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"></path>
            <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"></path>
          </svg>
          Google
        </button>
      </div>
    </main>
  );
};
