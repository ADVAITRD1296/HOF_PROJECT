import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Search, MapPin, Building2, Shield, Info, ArrowRight, Navigation } from 'lucide-react';
import { api } from '../services/api';

export const AuthoritiesPage: React.FC = () => {
  const [locationQuery, setLocationQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async () => {
    if (!locationQuery.trim()) return;
    
    setIsSearching(true);
    setResult(null);
    setErrorMsg('');
    try {
      const data = await api.getNearbyLegalServices(locationQuery);
      if (data.requires_location_input) {
         setErrorMsg("We couldn't detect a clear location from your input. Please try entering a specific city or town.");
      } else {
         setResult(data);
      }
    } catch (error) {
      console.error("Search failed", error);
      setErrorMsg("Failed to retrieve nearby services. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const renderCategory = (title: string, places: any[], icon: React.ReactNode) => {
    if (!places || places.length === 0) return null;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20">
            {icon}
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.map((place, idx) => (
            <div key={idx} className="p-5 glass-panel border border-white/10 rounded-2xl flex flex-col gap-3 group hover:border-primary/30 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm leading-tight">{place.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {place.distance_km} km away
                  </span>
                </div>
                <a 
                  href={place.map_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-primary hover:text-primary-foreground transition-all flex-shrink-0"
                  title="View on OpenStreetMap"
                >
                  <Map className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed truncate-2-lines" title={place.address}>
                {place.address}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
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
          Standalone jurisdictional mapping for immediate points of contact. Find the nearest station, court, or legal help anywhere in India.
        </p>
      </div>

      {/* Control Panel */}
      <div className="glass-panel border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Map className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto py-4">
          <div className="flex items-center gap-2 mb-2 w-full justify-center">
            <Navigation className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-white uppercase tracking-widest">Enter Any Indian Location</span>
          </div>
          
          <div className="w-full relative">
            <input 
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Nagpur, Andheri Mumbai, or 'Case happened in Pune'"
              className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-lg transition-all"
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          </div>

          {errorMsg && (
            <p className="text-[#F87171] text-sm font-bold bg-[#F87171]/10 px-4 py-2 rounded-lg border border-[#F87171]/20">
              {errorMsg}
            </p>
          )}

          <button
            onClick={handleSearch}
            disabled={!locationQuery.trim() || isSearching}
            className={`mt-4 px-12 py-4 rounded-full font-manrope font-bold text-lg tracking-tight transition-all flex items-center gap-3 ${
              !locationQuery.trim() || isSearching
                ? 'opacity-50 cursor-not-allowed bg-white/5 text-white'
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
            className="space-y-10"
          >
            <div className="flex items-center gap-4 px-6 border-l-4 border-primary">
              <div className="flex flex-col">
                <h2 className="text-2xl font-manrope font-black text-white uppercase tracking-tighter">
                  Intelligence for {result.location_detected}
                </h2>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Verified Contact Protocol Initialized
                </span>
              </div>
            </div>
            
            {renderCategory("Police Stations", result.police_stations, <Shield className="w-4 h-4 text-primary" />)}
            {renderCategory("Courts & Tribunals", result.courts, <Building2 className="w-4 h-4 text-primary" />)}
            {renderCategory("Legal Services", result.legal_services, <Info className="w-4 h-4 text-primary" />)}

            {(!result.police_stations?.length && !result.courts?.length && !result.legal_services?.length) && (
              <div className="p-8 text-center text-white/50 border border-white/5 rounded-2xl bg-white/5">
                No nearby authorities found within the scanning radius. Try another location.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !isSearching && (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-[3rem] opacity-20 mt-4">
          <MapPin className="w-12 h-12 mb-4" />
          <p className="font-manrope font-bold uppercase tracking-widest">Location Required</p>
          <p className="text-xs">Enter a location to map nearby legal infrastructure.</p>
        </div>
      )}
    </div>
  );
};
