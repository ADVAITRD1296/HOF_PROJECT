import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Globe, Moon, Bell, ShieldCheck, Cpu, Sliders } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage } = useAppContext();

  const sections = [
    {
      title: 'Linguistic Interface',
      icon: <Globe className="w-5 h-5 text-primary" />,
      description: 'Control the primary language of the intelligence engine.',
      control: (
        <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${language === 'en' ? 'bg-primary text-black shadow-lg' : 'text-muted-foreground hover:text-white'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage('hi')}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${language === 'hi' ? 'bg-primary text-black shadow-lg' : 'text-muted-foreground hover:text-white'}`}
          >
            Hindi
          </button>
        </div>
      )
    },
    {
      title: 'Luminance Protocol',
      icon: <Moon className="w-5 h-5 text-[#e9c176]" />,
      description: 'Adjust the visual weight of the glassmorphism interface.',
      control: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      )
    },
    {
      title: 'Neural Alerts',
      icon: <Bell className="w-5 h-5 text-primary" />,
      description: 'Immediate notification when new precedents are discovered.',
      control: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      )
    },
    {
      title: 'Encryption Matrix',
      icon: <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />,
      description: 'Current Status: Military Grade RSA-2048 Enforced.',
      control: (
        <span className="text-[10px] font-extrabold text-[#4ADE80] uppercase tracking-widest px-3 py-1 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-full">Secure</span>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5">
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl font-manrope font-extrabold text-white tracking-tight">System Protocols</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, idx) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                {section.icon}
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-manrope font-extrabold text-white tracking-tight mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground font-sans">{section.description}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              {section.control}
            </div>
          </motion.div>
        ))}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col items-center text-center"
        >
          <div className="p-4 bg-primary/20 rounded-full mb-6">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-manrope font-extrabold text-white mb-2 tracking-tight">Advanced Logic Engine</h2>
          <p className="text-muted-foreground text-sm max-w-sm mb-8 font-sans">You are currently operating on Llama-3-Sovereign-v2. All computational logic is executed via secure-sharding.</p>
          <button className="w-full max-w-xs bg-primary text-black font-manrope font-extrabold text-xs py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Sliders className="w-4 h-4" />
            Adjust Neural Weights
          </button>
        </motion.div>
      </div>
    </div>
  );
};
