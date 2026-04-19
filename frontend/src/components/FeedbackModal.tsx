import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Feedback submitted:", { name, email, rating, message });
    // In a real app, send to backend
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
            onClick={onClose}
          />
          <div className="fixed inset-0 pointer-events-none z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="pointer-events-auto w-full max-w-3xl bg-card/80 backdrop-blur-2xl rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-border/50"
            >
              <div className="mb-10 text-center">
                <h1 className="font-manrope text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4">Provide Counsel</h1>
                <p className="font-sans text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                    Your insights shape the intelligence of LexisCo. Please detail your feedback below for our architectural review.
                </p>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="font-sans text-xs tracking-wide text-primary uppercase" htmlFor="feedback-name">Full Name</label>
                    <input 
                      className="w-full bg-black/40 text-foreground font-sans border-0 border-b border-border/50 focus:ring-0 focus:border-[#e9c176] transition-colors py-3 px-4 rounded-t-lg outline-none placeholder:text-muted-foreground/50" 
                      id="feedback-name" 
                      placeholder="E.g., Jonathan Harker" 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="font-sans text-xs tracking-wide text-primary uppercase" htmlFor="feedback-email">Email</label>
                    <input 
                      className="w-full bg-black/40 text-foreground font-sans border-0 border-b border-border/50 focus:ring-0 focus:border-[#e9c176] transition-colors py-3 px-4 rounded-t-lg outline-none placeholder:text-muted-foreground/50" 
                      id="feedback-email" 
                      placeholder="counsel@firm.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <label className="font-sans text-xs tracking-wide text-primary uppercase">Experience Rating</label>
                  <div className="flex items-center gap-2 p-3 bg-black/30 backdrop-blur-md rounded-lg border border-border/30 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        type="button"
                        className={`transition-all duration-300 hover:scale-110 ${
                          star <= (hoverRating || rating) 
                            ? 'text-[#e9c176] drop-shadow-[0_0_12px_rgba(233,193,118,0.4)]' 
                            : 'text-[#e9c176]/30'
                        }`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <span 
                          className="material-symbols-outlined !text-3xl" 
                          style={{ fontVariationSettings: `'FILL' ${star <= (hoverRating || rating) ? 1 : 0}` }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Context */}
                <div className="space-y-2 mt-8">
                  <label className="font-sans text-xs tracking-wide text-primary uppercase" htmlFor="feedback-message">Detailed Feedback</label>
                  <textarea 
                    className="w-full bg-black/40 text-foreground font-sans border-0 border-b border-border/50 focus:ring-0 focus:border-[#e9c176] transition-colors py-3 px-4 rounded-t-lg resize-none outline-none placeholder:text-muted-foreground/50 h-32" 
                    id="feedback-message" 
                    placeholder="Elaborate on your findings..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col md:flex-row gap-4 justify-end">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 rounded-full font-sans font-medium tracking-wide border border-border/50 bg-transparent text-muted-foreground hover:text-white hover:bg-card transition-colors flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 rounded-full font-sans font-medium tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(232,232,232,0.1)]"
                  >
                    <span>Submit Counsel</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
