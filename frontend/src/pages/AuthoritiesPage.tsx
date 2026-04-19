import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Search, MapPin, Building2, Shield, Info, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { LocationGuidance } from '../components/LocationGuidance';
import type { LocationGuidance as LocationGuidanceType } from '../services/mockData';

const CITIES = [
  { id: 'delhi', name: 'Delhi', region: 'NCR' },
  { id: 'mumbai', name: 'Mumbai', region: 'Maharashtra' },
  { id: 'bangalore', name: 'Bangalore', region: 'Karnataka' },
  { id: 'lucknow', name: 'Lucknow', region: 'Uttar Pradesh' },
  { id: 'chennai', name: 'Chennai', region: 'Tamil Nadu' },
  { id: 'hyderabad', name: 'Hyderabad', region: 'Telangana' },
];

const CATEGORIES = [
  { id: 'default', name: 'General Legal Aid', icon: Building2 },
  { id: 'cybercrime', name: 'Cyber & Financial Fraud', icon: Shield },
  { id: 'consumer', name: 'Consumer & Product Disputes', icon: Search },
  { id: 'fir', name: 'Criminal Offenses (FIR)', icon: Info },
  { id: 'labour', name: 'Employment & Salary', icon: Building2 },
  { id: 'women', name: 'Women Safety & Family', icon: Shield },
];

export const AuthoritiesPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [result, setResult] = useState<LocationGuidanceType | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!selectedCity) return;
    
    setIsSearching(true);
    setResult(null);
    try {
      const data = await api.getLocationGuidance(selectedCity, selectedCategory);
      setResult(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-4xl font-manrope font-extrabold text-white tracking-tight">Nearby Authorities</h1>
        </div>
        <p className="text-muted-foreground font-sans text-sm max-w-2xl">
          Standalone jurisdictional mapping for immediate points of contact. Find the nearest station, court, or helpline for your specific legal territory.
        </p>
      </div>

      {/* Control Panel */}
      <div className="glass-panel border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Map className="w-32 h-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* City Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Select Your Jurisdiction</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`p-4 rounded-xl border transition-all text-left group ${
                    selectedCity === city.id 
                      ? 'bg-primary border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className={`block font-extrabold text-sm ${selectedCity === city.id ? 'text-primary-foreground' : 'text-white'}`}>
                    {city.name}
                  </span>
                  <span className={`text-[10px] uppercase tracking-tighter ${selectedCity === city.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {city.region}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Select Issue Category</span>
            </div>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    selectedCategory === cat.id 
                      ? 'bg-white/10 border-primary shadow-sm' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-bold text-sm ${selectedCategory === cat.id ? 'text-white' : 'text-muted-foreground'}`}>
                      {cat.name}
                    </span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${selectedCategory === cat.id ? 'bg-primary animate-pulse' : 'bg-white/10'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex justify-center">
          <button
            onClick={handleSearch}
            disabled={!selectedCity || isSearching}
            className={`px-12 py-4 rounded-full font-manrope font-bold text-lg tracking-tight transition-all flex items-center gap-3 ${
              !selectedCity || isSearching
                ? 'opacity-50 cursor-not-allowed bg-white/5'
                : 'bg-primary text-primary-foreground hover:scale-105 shadow-xl hover:shadow-primary/20'
            }`}
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Retrieving Maps...
              </>
            ) : (
              <>
                Reveal Nearby Authorities
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 px-6 border-l-4 border-primary">
              <div className="flex flex-col">
                <h2 className="text-2xl font-manrope font-black text-white uppercase tracking-tighter">
                  Intelligence for {CITIES.find(c => c.id === selectedCity)?.name}
                </h2>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Verified Contact Protocol Initialized
                </span>
              </div>
            </div>
            
            <LocationGuidance data={result} />
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !isSearching && (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
          <MapPin className="w-12 h-12 mb-4" />
          <p className="font-manrope font-bold uppercase tracking-widest">Select Parameters</p>
          <p className="text-xs">Define city and issue to reveal navigational intelligence.</p>
        </div>
      )}
    </div>
  );
};
