import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Plus, 
  X,
  ChevronRight,
  Gauge,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'strength' | 'duration'>('strength');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Strength Inputs
  const [strengthForm, setStrengthForm] = useState({
    description: '',
    caseType: 'Civil',
    evidence: [] as string[],
    hasWitnesses: false,
    hasDocs: false,
    newEvidence: ''
  });

  // Duration Inputs
  const [durationForm, setDurationForm] = useState({
    caseType: 'Civil',
    courtLevel: 'District Court',
    complexity: 'Medium',
    jurisdiction: ''
  });

  const handleAnalyzeStrength = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await api.analyzeCaseStrength({
        case_description: strengthForm.description,
        evidence_list: strengthForm.evidence,
        witnesses: strengthForm.hasWitnesses,
        documentation: strengthForm.hasDocs,
        case_type: strengthForm.caseType
      });
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.error || "Intelligence engine returned a protocol error.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Network disruption detected in the analysis cluster.");
    } finally {
      setLoading(false);
    }
  };

  const handleEstimateDuration = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await api.estimateCaseDuration({
        case_type: durationForm.caseType,
        court_level: durationForm.courtLevel,
        complexity: durationForm.complexity,
        jurisdiction: durationForm.jurisdiction
      });
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.error || "Prognosis algorithms encountered a state conflict.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Connection to judicial benchmark database timed out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-manrope font-black text-white tracking-tight uppercase">Legal Analytics Lab</h1>
        <p className="text-muted-foreground max-w-2xl text-sm tracking-wide">
          Advanced computational prognosis for Indian legal proceedings. Analyze case strength and estimate judicial timelines.
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="flex gap-4 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
        <button 
          onClick={() => { setActiveTab('strength'); setResult(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${activeTab === 'strength' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
        >
          <Activity className="w-4 h-4" />
          Case Strength
        </button>
        <button 
          onClick={() => { setActiveTab('duration'); setResult(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${activeTab === 'duration' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
        >
          <Clock className="w-4 h-4" />
          Duration Prognosis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Input Panel */}
        <div className="bg-card border border-border/50 rounded-3xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            {activeTab === 'strength' ? <Activity className="w-24 h-24" /> : <Clock className="w-24 h-24" />}
          </div>

          <h2 className="text-xl font-bold flex items-center gap-3">
            {activeTab === 'strength' ? 'Strength Parameters' : 'Prognosis Variables'}
          </h2>

          {activeTab === 'strength' ? (
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Case Description</label>
                <textarea 
                  value={strengthForm.description}
                  onChange={e => setStrengthForm({...strengthForm, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-32 outline-none focus:border-primary transition-colors text-sm"
                  placeholder="Describe the legal situation in detail..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Case Type</label>
                  <select 
                    value={strengthForm.caseType}
                    onChange={e => setStrengthForm({...strengthForm, caseType: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm appearance-none"
                  >
                    <option>Civil</option>
                    <option>Criminal</option>
                    <option>Corporate</option>
                    <option>Family</option>
                  </select>
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <button 
                    onClick={() => setStrengthForm({...strengthForm, hasWitnesses: !strengthForm.hasWitnesses})}
                    className={`flex-1 p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${strengthForm.hasWitnesses ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground'}`}
                  >
                    Witnesses
                  </button>
                  <button 
                    onClick={() => setStrengthForm({...strengthForm, hasDocs: !strengthForm.hasDocs})}
                    className={`flex-1 p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${strengthForm.hasDocs ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground'}`}
                  >
                    Papers
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Evidence Checklist</label>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text"
                    value={strengthForm.newEvidence}
                    onChange={e => setStrengthForm({...strengthForm, newEvidence: e.target.value})}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-primary"
                    placeholder="Add evidence (e.g. Email logs)"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && strengthForm.newEvidence) {
                        setStrengthForm({
                          ...strengthForm, 
                          evidence: [...strengthForm.evidence, strengthForm.newEvidence],
                          newEvidence: ''
                        });
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (strengthForm.newEvidence) {
                        setStrengthForm({
                          ...strengthForm, 
                          evidence: [...strengthForm.evidence, strengthForm.newEvidence],
                          newEvidence: ''
                        });
                      }
                    }}
                    className="p-3 bg-primary text-black rounded-xl hover:scale-105 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strengthForm.evidence.map((item, i) => (
                    <span key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs">
                      {item}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => setStrengthForm({...strengthForm, evidence: strengthForm.evidence.filter((_, idx) => idx !== i)})} />
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAnalyzeStrength}
                disabled={loading || strengthForm.description.length < 10}
                className="w-full py-4 bg-primary text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : (
                  <>Calculate Strength <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Case Genre</label>
                  <select 
                    value={durationForm.caseType}
                    onChange={e => setDurationForm({...durationForm, caseType: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm appearance-none"
                  >
                    <option>Property Dispute</option>
                    <option>Corporate Litigation</option>
                    <option>Criminal Trial</option>
                    <option>Divorce/Matrimonial</option>
                    <option>Consumer Court</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Court Level</label>
                  <select 
                    value={durationForm.courtLevel}
                    onChange={e => setDurationForm({...durationForm, courtLevel: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm appearance-none"
                  >
                    <option>District Court</option>
                    <option>High Court</option>
                    <option>Supreme Court</option>
                    <option>Tribunal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Procedural Complexity</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((c) => (
                    <button 
                      key={c}
                      onClick={() => setDurationForm({...durationForm, complexity: c})}
                      className={`flex-1 p-4 rounded-xl border transition-all text-xs font-bold uppercase ${durationForm.complexity === c ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Specific Jurisdiction (Optional)</label>
                <input 
                  type="text"
                  value={durationForm.jurisdiction}
                  onChange={e => setDurationForm({...durationForm, jurisdiction: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                />
              </div>

              <button 
                onClick={handleEstimateDuration}
                disabled={loading}
                className="w-full py-4 bg-primary text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Estimating...' : (
                  <>Estimate Duration <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: Results Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mb-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-destructive uppercase tracking-widest">Calculated Failure</p>
                  <p className="text-xs text-destructive/80 leading-relaxed font-medium">{error}</p>
                </div>
              </motion.div>
            )}

            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card/30 border border-dashed border-border/50 rounded-3xl h-[400px] flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="p-4 bg-white/5 rounded-full mb-4">
                  <Activity className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
                <h3 className="text-white/60 font-bold mb-2">Awaiting Parameters</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Input your case data and execute a calculation to see the deep intelligence analysis.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border/50 rounded-3xl p-8 space-y-8 backdrop-blur-2xl shadow-2xl overflow-hidden relative"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full"></div>

                {activeTab === 'strength' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">Analysis Result</span>
                        <h3 className="text-3xl font-black text-white">{result.strength_label}</h3>
                      </div>
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                          <circle 
                            cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" 
                            className="text-primary transition-all duration-1000"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * result.overall_strength_score) / 100}
                          />
                        </svg>
                        <span className="absolute text-xl font-black text-white">{result.overall_strength_score}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Evidence', score: result.evidence_score },
                        { label: 'Docs', score: result.documentation_score },
                        { label: 'Merit', score: result.legal_merit_score },
                        { label: 'Witness', score: result.witness_score },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase font-bold text-muted-foreground">{stat.label}</span>
                            <span className="text-xs font-bold text-white">{stat.score}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary/40" style={{ width: `${stat.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Recommendations</span>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-2xl border-l-2 border-primary">
                        {result.recommendation}
                      </p>
                    </div>

                    {result.missing_elements.length > 0 && (
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 text-yellow-500" /> Improvement Vector
                        </label>
                        <div className="space-y-2">
                          {result.missing_elements.map((item: string, i: number) => (
                            <div key={i} className="flex gap-3 items-start p-3 bg-white/2 rounded-xl border border-white/5">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0"></div>
                              <span className="text-xs text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10 overflow-hidden relative">
                      <div className="absolute -left-4 -bottom-4 opacity-5">
                        <CalendarDays className="w-24 h-24" />
                      </div>
                      <div className="space-y-1 relative z-10">
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">Estimated Period</span>
                        <div className="text-4xl font-black text-white flex items-baseline gap-2">
                          {Math.floor(result.estimated_months_min / 12)}-{Math.ceil(result.estimated_months_max / 12)}
                          <span className="text-sm font-normal text-muted-foreground uppercase tracking-[0.2em] ml-1">Years</span>
                        </div>
                      </div>
                      <div className="text-right relative z-10">
                        <div className="flex items-center justify-end gap-2 text-primary mb-1">
                          <Gauge className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">{result.confidence_score}% Confidence</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase max-w-[120px]">Machine Learning Projection</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[#e9c176]">
                            <Info className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Considerations</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {result.factors_considered.map((f: string, i: number) => (
                              <span key={i} className="text-[10px] bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-white/60">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Bottlenecks</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {result.bottlenecks.map((b: string, i: number) => (
                              <span key={i} className="text-[10px] bg-destructive/10 border border-destructive/10 px-3 py-1.5 rounded-lg text-destructive/80 font-bold">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-white/10"></div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Optimizations</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {result.optimizations.map((item: string, i: number) => (
                            <div key={i} className="flex gap-3 items-center p-3 bg-green-400/5 rounded-2xl border border-green-400/10">
                              <ChevronRight className="w-4 h-4 text-green-400" />
                              <span className="text-xs text-green-400/80 font-bold">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl text-[10px] text-muted-foreground italic leading-relaxed border border-white/5">
                        <span className="font-bold text-white/50 block mb-1 uppercase">Methodology Basis:</span>
                        {result.precedent_basis}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
