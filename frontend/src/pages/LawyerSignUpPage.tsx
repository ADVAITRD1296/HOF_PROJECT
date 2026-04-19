import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { LawyerVerificationModal } from '../components/LawyerVerificationModal';
import { ShieldCheck, MapPin, Briefcase, Scale, ArrowRight, Check } from 'lucide-react';

export const LawyerSignUpPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bar_council_id: '',
    state_bar_council: '',
    practice_areas: [] as string[],
    experience_years: 5,
    office_address: '',
    city: '',
    pincode: '',
    consultation_fee: 1500,
    latitude: 0,
    longitude: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [locStatus, setLocStatus] = useState<'idle' | 'detecting' | 'found' | 'error'>('idle');
  const [showVerification, setShowVerification] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const specialties = [
    'Criminal', 'Civil', 'Corporate', 'Family', 
    'Cybercrime', 'Property', 'Consumer', 'Intellectual Property',
    'Tax', 'Employment', 'Insurance', 'Human Rights'
  ];

  useEffect(() => {
    // Attempt auto-location on mount
    detectLocation();
  }, []);

  const detectLocation = () => {
    setLocStatus('detecting');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }));
          setLocStatus('found');
        },
        (err) => {
          console.warn("Geolocation failed", err);
          setLocStatus('error');
        }
      );
    } else {
      setLocStatus('error');
    }
  };

  const toggleSpecialty = (s: string) => {
    setFormData(prev => ({
      ...prev,
      practice_areas: prev.practice_areas.includes(s) 
        ? prev.practice_areas.filter(a => a !== s)
        : [...prev.practice_areas, s]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.practice_areas.length === 0) {
      setError("Please select at least one practice area.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Trigger OTP
      await api.sendLawyerOTP(formData.email);
      setShowVerification(true);
    } catch (err: any) {
      console.error("OTP Error:", err);
      const msg = err.response?.data?.detail || err.message || "Protocol Initialization Failed";
      setError(`Auth Protocol Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalRegistration = async () => {
    setShowVerification(false);
    setIsLoading(true);
    setError('');

    try {
      await api.registerLawyer({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        bar_council_id: formData.bar_council_id,
        state_bar_council: formData.state_bar_council,
        practice_areas: formData.practice_areas,
        experience_years: formData.experience_years,
        office_address: formData.office_address,
        city: formData.city,
        pincode: formData.pincode,
        consultation_fee: formData.consultation_fee,
        latitude: formData.latitude || 28.6139,
        longitude: formData.longitude || 77.2090
      });
      
      console.log("Registration Successful! Showing Success View.");
      window.alert("Registration successful! Your profile is now being verified.");
      setIsSuccess(true);
      // Success state handles the view
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.detail || "Final validation failed. Profile record could not be established.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    console.log("Rendering SUCCESS view - No complex components used.");
    return (
      <div 
        style={{ 
          backgroundColor: '#0A0A0A', 
          color: 'white', 
          minHeight: '100vh', 
          width: '100vw', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '20px',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          fontFamily: 'sans-serif'
        }}
      >
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '440px', 
            backgroundColor: '#111', 
            border: '1px solid #333', 
            borderRadius: '40px', 
            padding: '48px', 
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>Success Established</h1>
          <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
            Your professional identity protocol has been registered. Our verification algorithms are now validating your credentials. 
          </p>
          <button 
            onClick={() => {
              console.log("Navigating to Sign In");
              navigate('/sign-in');
            }}
            style={{ 
              width: '100%', 
              backgroundColor: 'white', 
              color: 'black', 
              padding: '18px', 
              borderRadius: '16px', 
              fontWeight: '800', 
              fontSize: '14px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              border: 'none',
              transition: 'opacity 0.2s'
            }}
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col antialiased relative overflow-x-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] z-0"></div>
      
      <main className="flex-grow flex flex-col items-center justify-center relative w-full py-20 px-4">
        <div className="relative z-10 w-full max-w-2xl p-10 glass-panel rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="mb-10 text-center flex flex-col items-center gap-4">
             <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
              <Scale className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-manrope text-3xl font-extrabold text-white tracking-tight">Legal Professional Enrollment</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Join the LexisCo Intelligence Network</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Identity */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Professional Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase ml-1">Full Name</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    placeholder="Adv. John Doe"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase ml-1">Email</label>
                  <input 
                    required
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase ml-1">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase ml-1">Bar ID</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    placeholder="D/1234/2020"
                    value={formData.bar_council_id}
                    onChange={e => setFormData({...formData, bar_council_id: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase ml-1">State Bar Council</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    placeholder="Delhi"
                    value={formData.state_bar_council}
                    onChange={e => setFormData({...formData, state_bar_council: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Expertise */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Practice Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {specialties.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSpecialty(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      formData.practice_areas.includes(s)
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Location */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Precise Jurisdiction
              </h3>
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl mb-4">
                <div className={`p-2 rounded-full ${locStatus === 'found' ? 'bg-green-500/20 text-green-500' : 'bg-primary/10 text-primary'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">
                    {locStatus === 'detecting' ? 'Analyzing GPS Signals...' : locStatus === 'found' ? 'Location Locked' : 'GPS Access Denied'}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    {locStatus === 'found' ? `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}` : 'Please enable location for local matching'}
                  </p>
                </div>
                {locStatus !== 'found' && (
                  <button type="button" onClick={detectLocation} className="text-[10px] font-bold text-primary uppercase border-b border-primary">Retry</button>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase ml-1">Office Address</label>
                <textarea 
                  required
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all resize-none"
                  placeholder="Street, Landmark, Chamber No."
                  value={formData.office_address}
                  onChange={e => setFormData({...formData, office_address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase ml-1">City</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase ml-1">Years of Exp.</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    value={formData.experience_years}
                    onChange={e => setFormData({...formData, experience_years: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-manrope font-extrabold py-5 rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'ESTABLISHING PROTOCOL...' : 'JOIN SUPREME COUNSEL'}
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="text-center">
              <Link to="/sign-up" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-white transition-colors">
                Back to Personal Inquiry
              </Link>
            </div>
          </form>
        </div>
      </main>

      <LawyerVerificationModal 
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        email={formData.email}
        onVerified={handleFinalRegistration}
      />
    </div>
  );
};
