import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, ArrowRight, X, RefreshCcw } from 'lucide-react';
import { api } from '../services/api';

interface LawyerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerified: () => void;
}

export const LawyerVerificationModal: React.FC<LawyerVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  email, 
  onVerified 
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) return;

    setIsLoading(true);
    setError('');
    try {
      await api.verifyLawyerOTP(email, fullCode);
      onVerified();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await api.sendLawyerOTP(email);
      setResendCooldown(60);
    } catch (err) {
      setError("Failed to resend code.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShieldCheck className="w-24 h-24" />
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-manrope font-black text-white tracking-tight mb-2 uppercase">Verify Legal Identity</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We've sent a 6-digit authentication protocol to <span className="text-white font-bold">{email}</span>. Please enter it below to confirm your professional status.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-2 mb-8">
          {code.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:border-primary focus:bg-white/10 outline-none transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading || code.join('').length < 6}
          className="w-full bg-white text-black font-manrope font-extrabold py-4 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'VALIDATING...' : 'VERIFY AUTHENTICITY'}
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Didn't receive the protocol?</p>
          <button 
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="flex items-center gap-2 text-xs font-bold text-primary group disabled:opacity-50"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            {resendCooldown > 0 ? `Retry in ${resendCooldown}s` : 'Resend Verification Code'}
          </button>
        </div>
      </div>
    </div>
  );
};
