import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Lawyer } from '../services/mockData';
import { LawyerCard } from '../components/LawyerCard';
import { Search, MapPin, Navigation, Filter, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAppContext } from '../AppContext';

export const LawyersPage: React.FC = () => {
  const { aiResponse } = useAppContext();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [searchQuery, setSearchQuery] = useState(aiResponse?.issue || '');
  const [isLoading, setIsLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<'Detecting' | 'Active' | 'Default'>('Detecting');
  const [userCoords, setUserCoords] = useState<{lat: number, lon: number} | null>(null);

  const fetchLawyers = async (query: string = '', coords?: {lat: number, lon: number}) => {
    setIsLoading(true);
    try {
      const results = await api.getLawyers(
        query, 
        coords?.lat, 
        coords?.lon
      );
      setLawyers(results);
      setLocationStatus(coords ? 'Active' : 'Default');
    } catch (e) {
      console.error(e);
      setLocationStatus('Default');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setUserCoords(coords);
          fetchLawyers(searchQuery, coords);
        },
        () => {
          fetchLawyers(searchQuery);
        }
      );
    } else {
      fetchLawyers(searchQuery);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLawyers(searchQuery, userCoords || undefined);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-4xl font-manrope font-extrabold text-white tracking-tight">Lawyer Connect</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground font-sans text-sm">Verified legal professionals within your immediate jurisdiction.</p>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
              locationStatus === 'Active' ? 'bg-[#4ADE80]/5 border-[#4ADE80]/20 text-[#4ADE80]' : 'bg-white/5 border-white/5 text-muted-foreground'
            }`}>
              <MapPin className="w-3 h-3" />
              {locationStatus === 'Detecting' ? 'Syncing Location...' : locationStatus === 'Active' ? 'Precision Match: On' : 'Default Area'}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search by specialty or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-lg"
          />
        </form>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
              ))}
            </motion.div>
          ) : lawyers.length > 0 ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12"
            >
              {lawyers.map(l => (
                <LawyerCard key={l.id} data={l} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-20 opacity-30 text-center"
            >
              <Search className="w-16 h-16 mb-4" />
              <p className="font-manrope text-xl font-bold uppercase tracking-widest">No Matches Found</p>
              <p className="text-sm mt-2">Adjust your search parameters or location.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
          <Info className="w-3 h-3 text-primary" />
          Independent Review Enforced
        </div>
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
          BCI Registry Verified — Secure Match Protocol {Math.floor(Math.random()*10000)}
        </p>
      </div>
    </div>
  );
};

