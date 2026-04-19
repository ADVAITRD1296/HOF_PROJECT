import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { api } from '../services/api';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { setState } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await api.login(email, password);
      
      if (result.session) {
        localStorage.setItem('lexisco_token', result.session);
      }

      setState(prev => ({
        ...prev,
        user: { 
          id: result.user.id, 
          email: result.user.email, 
          name: result.user.name || result.user.email.split('@')[0]
        }
      }));
      // Assuming successful login, redirect to dashboard
      navigate('/dashboard/ask');
    } catch (err: any) {
      // Use the standardized message from interceptor or fallback
      const detail = err.response?.data?.detail || err.message;
      setError(detail || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col antialiased selection:bg-secondary selection:text-secondary-foreground relative">
      <main 
        className="flex-grow flex items-center justify-center relative w-full overflow-hidden" 
        style={{
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvcy8guUhwabn2-cNw03C3WkpwME_e5aK_K8fl8HfLI5n67o-0itBvlVIvMJWzI3Q2E3tNmok6yGQuyGjFJOXGqB8vVA80flG2mLrQgQFOjE9Yg_0CtqlR4XQBNR847ovhUHVP8rsaPEk8Yso9XHlRsZHs2f6SuzfCyBj1fJ8YSafdMJZ9wU8UKzjGwNR_FhZGsxFFu9ibKgpLI3VUizc3gzb0AbkVKlrMvdrtPH7Cuo-_90xJmQpaCcMoqnCTQL4MzJz9-tDBMN4')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}
      >
        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>
        
        {/* Glassmorphism Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md mx-auto p-12 glass-panel rounded-[2rem] border border-border/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center"
        >
          {/* Logo / Brand Anchor */}
          <div className="mb-10 flex flex-col items-center gap-4 w-full">
            <div className="w-16 h-16 rounded-xl bg-card flex items-center justify-center border border-border/30 shadow-inner">
              <span className="material-symbols-outlined text-4xl text-primary font-light" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            </div>
            <Link to="/" className="font-manrope text-3xl font-extrabold tracking-tighter text-primary hover:opacity-80 transition-opacity">LexisCo</Link>
            <p className="font-sans text-sm text-muted-foreground tracking-wide uppercase">The Sovereign Scholar</p>
          </div>
          
          {/* Header */}
          <div className="text-center w-full mb-8">
            <h2 className="font-manrope text-2xl font-bold text-primary tracking-tight mb-2">Welcome User</h2>
            <p className="font-sans text-muted-foreground text-sm">Sign in to access your intelligence dashboard.</p>
          </div>
          
          {/* Form */}
          <form className="w-full flex flex-col gap-6" onSubmit={handleSignIn}>
            {error && (
              <div className="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded-xl text-sm font-sans tracking-wide">
                {error}
              </div>
            )}
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">mail</span>
                <input 
                  className="w-full bg-black/60 border-b border-white/20 focus:border-primary focus:bg-black/80 text-primary font-sans text-sm py-4 pl-12 pr-4 rounded-xl transition-all duration-300 outline-none placeholder:text-muted-foreground/70" 
                  id="email" 
                  placeholder="scholar@lexisco.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-sans text-xs tracking-wider text-muted-foreground uppercase" htmlFor="password">Password</label>
                <a className="font-sans text-xs text-muted-foreground hover:text-primary transition-colors duration-300" href="#">Forgot?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">lock</span>
                <input 
                  className="w-full bg-black/60 border-b border-white/20 focus:border-primary focus:bg-black/80 text-primary font-sans text-sm py-4 pl-12 pr-4 rounded-xl transition-all duration-300 outline-none placeholder:text-muted-foreground/70" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Primary Action */}
            <button 
              className="w-full mt-4 bg-primary text-primary-foreground font-manrope font-bold text-sm py-4 rounded-full hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(232,232,232,0.1)] disabled:opacity-50" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
              {!isLoading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
            </button>
            
            {/* Secondary Action */}
            <Link 
              to="/sign-up"
              className="w-full mt-3 bg-transparent border border-border text-primary font-manrope font-bold text-sm py-4 rounded-full hover:bg-card transition-colors duration-300 flex items-center justify-center"
            >
              Create Account
            </Link>
          </form>
          
          {/* Divider */}
          <div className="w-full flex items-center gap-4 my-8">
            <div className="flex-grow h-px bg-border"></div>
            <span className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Or</span>
            <div className="flex-grow h-px bg-border"></div>
          </div>
          
          {/* Social Login */}
          <button 
            className="w-full bg-black/30 border border-border/30 text-primary font-sans text-sm py-4 rounded-full hover:bg-card transition-colors duration-300 flex items-center justify-center gap-3 backdrop-blur-md" 
            type="button" 
            onClick={() => alert("Google Authentication is coming in the next protocol version.")}
          >
            <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21528 6.86 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"></path>
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"></path>
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"></path>
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"></path>
            </svg>
            Sign in with Google
          </button>
        </motion.div>
      </main>
      
      {/* Footer Container */}
      <footer className="bg-[#0e0e0e] text-[#c6c6c6] font-sans text-sm tracking-wide full-width py-12 border-t border-[#c6c6c6]/10 flex flex-col md:flex-row justify-between items-center px-12 w-full relative z-10">
        <div className="text-lg font-bold text-[#c6c6c6] mb-6 md:mb-0">
            LexisCo
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
          <a className="text-[#c6c6c6]/40 hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Legal Terms</a>
          <a className="text-[#c6c6c6]/40 hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="text-[#c6c6c6]/40 hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Institutional Access</a>
          <a className="text-[#c6c6c6]/40 hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Security</a>
        </div>
        <div className="text-[#c6c6c6]/40">
            © 2024 LexisCo. The Sovereign Scholar Framework.
        </div>
      </footer>
    </div>
  );
};
