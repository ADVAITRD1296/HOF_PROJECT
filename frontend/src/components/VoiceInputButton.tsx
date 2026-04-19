import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, language }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
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
