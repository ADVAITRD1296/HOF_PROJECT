import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const LexisCoFeedbackForm: React.FC = () => {
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-secondary/30">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-12 h-20 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-widest text-white uppercase font-headline">LexisCo</Link>
        </div>
        <div className="hidden md:flex gap-8 items-center font-headline text-[10px] tracking-[0.2em] uppercase">
          <Link to="/mentor" className="text-[#c6c6c6]/60 hover:text-[#abc8f5] transition-colors">Intelligence</Link>
          <Link to="/subscription" className="text-[#c6c6c6]/60 hover:text-[#abc8f5] transition-colors">Subscription</Link>
          <Link to="/dashboard" className="text-[#c6c6c6]/60 hover:text-[#abc8f5] transition-colors">Dashboard</Link>
        </div>
        <div className="flex items-center gap-6">
           <Link to="/dashboard" className="h-8 w-8 rounded-full bg-white/5 overflow-hidden border border-white/10">
              <img alt="avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl-ofFfrfKdI-KbO84b2k6BBHvqFlqiNdWz86JBoXM9jT-vSY6cIyI07huxcYrGeiHkNfndb5fQ9g_87iCLSj149m9ngrdab_LVTmWMRsLkcO_BNqiDUH1RevDyAhVKJxvLlRaN7G3HBk3YY21rROjd6aEbFk68tlbTJOpnVsL2dtgDsDCtHFWwX1p9n9QWkIoDfqpAtupN9NHexblXa_X6LHWs5iloONkUQ8znOjzJIQKdRQ7FCKPvaUEYObabBYbOXOLx5wUkWQ"/>
           </Link>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-6">
        <div className="w-full max-w-3xl">
          {submitted ? (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
               <span className="material-symbols-outlined text-6xl text-secondary mb-6 block" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
               <h1 className="text-4xl font-bold mb-4">Feedback Recorded</h1>
               <p className="text-primary/50">Your counsel has been added to our architectural review. Redirecting to chambers...</p>
            </div>
          ) : (
            <>
              <div className="mb-12 text-center">
                <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">Provide Counsel</h1>
                <p className="font-body text-primary/50 text-base md:text-lg max-w-xl mx-auto">Your insights shape the intelligence of LexisCo. Help us refine the Sovereign Scholar architecture.</p>
              </div>

              <div className="liquid-glass rounded-2xl p-10 md:p-14 shadow-ambient border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] items-center uppercase tracking-widest text-primary/40 font-bold ml-1">Full Name</label>
                      <input required className="w-full bg-white/5 border border-white/5 text-white font-body py-3 px-4 rounded-xl focus:border-secondary transition-all outline-none" placeholder="E.g., Jonathan Harker" type="text"/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-primary/40 font-bold ml-1">Email</label>
                      <input required className="w-full bg-white/5 border border-white/5 text-white font-body py-3 px-4 rounded-xl focus:border-secondary transition-all outline-none" placeholder="counsel@firm.com" type="email"/>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-primary/40 font-bold ml-1">Experience Rating</label>
                    <div className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 w-fit">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => setRating(star)}
                          className={`${rating >= star ? 'text-tertiary drop-shadow-[0_0_8px_rgba(233,193,118,0.4)]' : 'text-white/20'} hover:scale-110 transition-all duration-200`}
                          type="button"
                        >
                          <span className="material-symbols-outlined !text-3xl" style={{fontVariationSettings: rating >= star ? "'FILL' 1" : "'FILL' 0"}}>star</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-primary/40 font-bold ml-1">Detailed Feedback</label>
                    <textarea required className="w-full bg-white/5 border border-white/5 text-white font-body py-4 px-4 rounded-2xl focus:border-secondary transition-all outline-none resize-none" placeholder="Elaborate on your findings..." rows={5}></textarea>
                  </div>

                  <div className="pt-6 flex flex-col md:flex-row gap-4 justify-end">
                    <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 rounded-full border border-white/10 text-primary/50 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
                      Cancel
                    </button>
                    <button type="submit" className="px-8 py-3 rounded-full bg-white text-black hover:bg-secondary hover:text-black transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-xl">
                      Submit Counsel
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="w-full border-t border-white/5 bg-black text-primary/30 py-12 px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex flex-col gap-2">
              <span className="text-xl font-bold text-white tracking-tighter">LexisCo</span>
              <p className="text-[10px] uppercase tracking-widest">© 2026 Sovereign Scholar Framework</p>
           </div>
           <div className="flex gap-8 text-[9px] uppercase tracking-[0.2em]">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/subscription" className="hover:text-white transition-colors">Pricing</Link>
           </div>
        </div>
      </footer>
    </div>
  );
};
