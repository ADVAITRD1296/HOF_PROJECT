import React, { useRef, useEffect } from 'react';
import { VoiceInputButton } from './VoiceInputButton';
import { LanguageToggle } from './LanguageToggle';
import { ArrowRight, Paperclip } from 'lucide-react';
import { useAppContext } from '../AppContext';

interface ChatInputProps {
  onSubmit: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit }) => {
  const { userInput, setUserInput, language, attachedFiles, setAttachedFiles } = useAppContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [userInput]);

  const handleSubmit = () => {
    if (userInput.trim().length === 0) return;
    onSubmit(userInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSimulateVoice = () => {
    setUserInput(
      language === 'en' 
        ? "I ordered a laptop online 3 weeks ago but it hasn't arrived. The seller stopped replying to my emails and isn't refunding my money."
        : "Maine 3 hafte pehle online laptop order kiya tha par abhi tak nahi aaya. Seller emails ka reply nahi kar raha aur paise bhi wapas nahi de raha."
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-4xl mx-auto">
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      
      <div className="relative flex items-end bg-[#111111] border border-[#222222] rounded-xl focus-within:border-[#444] transition-colors overflow-hidden">
        <button
          type="button"
          onClick={triggerFileUpload}
          className="p-4 pr-2 text-muted-foreground hover:text-white transition-colors"
          title="Attach evidence"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <textarea
          ref={textareaRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === 'en' ? "Describe your problem in simple language" : "Apni samasya aasaan bhasha mein batayein"}
          className="flex-1 max-h-[150px] min-h-[60px] bg-transparent border-none resize-none p-4 pl-1 pb-4 text-[15px] leading-relaxed text-white placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
          rows={1}
        />
        <div className="p-2 pb-2.5">
          <VoiceInputButton onSimulateInput={handleSimulateVoice} />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <LanguageToggle />
        
        <button
          onClick={handleSubmit}
          disabled={userInput.trim().length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white text-black bg-white hover:bg-[#E8E8E8] hover:border-[#E8E8E8] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
        >
          Analyze <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
