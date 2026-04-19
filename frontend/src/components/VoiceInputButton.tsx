import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputButtonProps {
  onSimulateInput: () => void;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onSimulateInput }) => {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    if (isListening) return;
    setIsListening(true);
    // Simulate listening for 2 seconds
    setTimeout(() => {
      setIsListening(false);
      onSimulateInput();
    }, 2000);
  };

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.4 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "easeInOut"
            }}
            className="absolute w-10 h-10 bg-white rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={handleClick}
        disabled={isListening}
        className={`relative z-10 p-3 rounded-full transition-colors duration-300 ${
          isListening ? 'bg-white text-black' : 'bg-transparent text-muted-foreground hover:bg-white/10 hover:text-white'
        }`}
        aria-label="Voice input"
      >
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
};
