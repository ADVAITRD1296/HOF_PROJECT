import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, Briefcase, Users, Settings, LogOut, Star, Map, Activity } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { FeedbackModal } from '../components/FeedbackModal';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { state, setState } = useAppContext();
  const navigate = useNavigate();

  const user = state.user || { name: 'Scholar User', email: 'scholar@lexisco.com' };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Ask Legal Problem', path: '/dashboard/ask', icon: MessageSquare },
    { name: 'Nearby Authorities', path: '/dashboard/authorities', icon: Map },
    { name: 'My Repository', path: '/dashboard/cases', icon: Briefcase },
    { name: 'Legal Analytics', path: '/dashboard/analytics', icon: Activity },
    { name: 'Identity Vault', path: '/dashboard/profile', icon: Users },
    { name: 'Lawyer Connect', path: '/dashboard/lawyers', icon: Users },
    { name: 'System Protocols', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null }));
    navigate('/sign-in');
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-foreground">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 flex flex-col border-r border-border/50 bg-black/40 backdrop-blur-xl relative z-20">
        <div className="p-6 pb-8 border-b border-border/50">
          <span className="text-xl font-bold tracking-widest uppercase font-manrope text-primary">LexisCo.</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  isActive 
                    ? 'bg-card text-white border-l-2 border-white pl-3.5 shadow-sm' 
                    : 'text-muted-foreground hover:bg-card/50 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border/50 flex flex-col gap-4 relative" ref={menuRef}>
          <LanguageToggle />
          
          <button 
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer w-full text-left"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-border flex items-center justify-center font-bold text-xs uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </button>

          {/* Menu Actions Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border/50 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden p-1 z-50 text-sm"
              >
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsFeedbackOpen(true); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-primary"
                >
                  <Star className="w-4 h-4 text-[#e9c176]" />
                  <span>Provide Feedback</span>
                </button>
                <div className="h-px bg-border/50 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-black flex flex-col z-10">
        {/* Subtle grid background for the main area to match new aesthetics */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20" 
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        ></div>
        
        <div className="flex-1 relative z-10 w-full max-w-5xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
        
        <footer className="p-6 border-t border-border/50 relative z-10">
          <p className="text-center text-[11px] text-muted-foreground uppercase tracking-widest font-sans leading-relaxed">
            Standard Operating Protocol — This is guidance, not professional advice.
          </p>
        </footer>
      </main>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};
