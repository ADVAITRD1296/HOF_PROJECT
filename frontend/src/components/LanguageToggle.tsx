import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../AppContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useAppContext();

  return (
    <div className="relative flex items-center bg-transparent border border-border rounded-full p-1 w-24">
      {/* Background slide indicator */}
      <motion.div
        className="absolute w-10 h-8 bg-white rounded-full z-0"
        initial={false}
        animate={{
          x: language === 'en' ? 2 : 46
        }}
        transition={{ type: "tween", duration: 0.2 }}
      />
      
      <button
        type="button"
        className={`relative z-10 flex-1 h-8 text-sm font-medium transition-colors duration-200 ${
          language === 'en' ? 'text-black' : 'text-muted-foreground hover:text-white'
        }`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      
      <button
        type="button"
        className={`relative z-10 flex-1 h-8 text-sm font-medium transition-colors duration-200 ${
          language === 'hi' ? 'text-black' : 'text-muted-foreground hover:text-white'
        }`}
        onClick={() => setLanguage('hi')}
      >
        HI
      </button>
    </div>
  );
};
