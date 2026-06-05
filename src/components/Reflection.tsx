import React from 'react';
import { Purchase, ReflectionAnalysis } from '../types';
import { Brain, Sparkles, Send, RefreshCw, AlertCircle, Quote, Compass, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReflectionProps {
  purchases: Purchase[];
}

export default function Reflection({ purchases }: ReflectionProps) {
  const [loading, setLoading] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<ReflectionAnalysis | null>(null);
  const [error, setError] = React.useState('');
  
  // Track journaling answers for each question
  const [journalEntries, setJournalEntries] = React.useState<{ [qIdx: number]: string }>({});
  const [savedJournal, setSavedJournal] = React.useState<{ [qIdx: number]: boolean }>({});

  const [loadingIndex, setLoadingIndex] = React.useState(0);
  const loadingPhrases = [
    'EcoReflect AI is analyzing your wardrobe checkouts...',
    'Reviewing category distribution & repetitive purchase triggers...',
    'Consulting SDG 12.8 structural frameworks...',
    'Mapping helpful, supportive reflection avenues...',
    'Structuring empathetic counseling cards...'
  ];

  // Rotate loading phrases
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadReflection = async (force: boolean = false) => {
    // If not forced and already loaded, reuse
    if (!force && analysis) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchases }),
      });

      if (!response.ok) {
        throw new Error('Connection to Sustainable reflection module aborted.');
      }

      const data = await response.json();
      setAnalysis(data);
      
      // Initialize empty journal states
      const initialJournals: { [key: number]: string } = {};
      data.questions.forEach((_: any, idx: number) => {
        initialJournals[idx] = '';
      });
      setJournalEntries(initialJournals);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while contacting reflection engine.');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first render if purchases are available
  React.useEffect(() => {
    loadReflection();
  }, [purchases]);

  const handleSaveJournal = (idx: number) => {
    if (!journalEntries[idx]?.trim()) return;
    setSavedJournal(prev => ({ ...prev, [idx]: true }));
    
    // Auto timeout to clear success state
    setTimeout(() => {
      setSavedJournal(prev => ({ ...prev, [idx]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-10 pb-16" id="reflection-center-container">
      {/* Intro */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-sans text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="h-7 w-7 text-emerald-600" /> AI Reflection Center
          </h1>
          <p className="text-slate-500 text-sm">Empathetic analysis of your buying habits designed to guide mindful, non-judgmental awareness.</p>
        </div>
        <button
          id="btn-reanalyze-habits"
          disabled={loading}
          onClick={() => loadReflection(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Request New AI Analysis
        </button>
      </div>

      {loading && (
        <div className="py-16 text-center space-y-4" id="reflection-loading">
          <div className="relative inline-flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-600"></div>
            <Brain className="absolute h-6 w-6 text-emerald-600 animate-pulse" />
          </div>
          <div className="h-8 max-w-sm mx-auto overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="text-slate-500 text-xs sm:text-sm font-medium"
              >
                {loadingPhrases[loadingIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 flex gap-3 text-red-800" id="reflection-error">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Failed to generate Reflection metrics</h4>
            <p className="text-xs mt-1">{error}</p>
            <button
              onClick={() => loadReflection(true)}
              className="mt-3 text-xs bg-white text-red-700 border border-red-200 font-bold px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {!loading && !error && analysis && (
        <div className="space-y-12" id="reflection-body-content">
          
          {/* Empathetic Coach Coach Summary Card */}
          <section className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden" id="reflection-summary-card">
            <div className="absolute top-0 right-0 h-44 w-44 bg-emerald-800/20 rounded-full blur-2xl"></div>
            <div className="space-y-4 relative">
              <span className="font-mono text-[10px] font-bold text-emerald-300 tracking-wider uppercase flex items-center gap-1">
                <Quote className="h-3.5 w-3.5" /> EMPOWERING HABIT ANALYSIS
              </span>
              <h2 className="font-sans text-xl font-bold sm:text-2xl">Sustainable Coach’s Reflection Summary</h2>
              <div className="border-l-2 border-emerald-400 pl-4 py-1">
                <p className="text-emerald-50 text-sm leading-relaxed font-sans">
                  {analysis.summary}
                </p>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium">
                Our analysis is fully compliant with SDG Target 12.8. No criticism; only support.
              </p>
            </div>
          </section>

          {/* DYNAMIC JOURNAL / INPUT FOR THE QUESTIONS */}
          <section className="space-y-6" id="journaling-questions">
            <h3 className="font-sans text-xl font-bold text-slate-800 flex items-center gap-2">
              <Compass className="h-5.5 w-5.5 text-emerald-600" /> Personal Introspection Journal
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              True behavior modification thrives on self-examination. Type your honest answers to these questions below to log your reflection.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {analysis.questions.map((question, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 shadow-2xs flex flex-col justify-between" id={`reflection-q-${idx}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-600 tracking-wider uppercase">QUESTION {idx + 1}</span>
                      <Brain className="h-4 w-4 text-slate-300" />
                    </div>
                    <label htmlFor={`journal-input-${idx}`} className="font-sans text-sm font-bold text-slate-800 leading-snug block">
                      {question}
                    </label>
                  </div>

                  <div className="space-y-2.5">
                    <textarea
                      id={`journal-input-${idx}`}
                      rows={3}
                      value={journalEntries[idx] || ''}
                      onChange={(e) => setJournalEntries({ ...journalEntries, [idx]: e.target.value })}
                      placeholder="Type your personal answers here... E.g. 'I fell for flash promotion triggers' or 'I wanted to match online social trends'."
                      className="w-full text-xs rounded-lg border border-slate-100 bg-slate-50/50 p-3 leading-relaxed placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                    />
                    
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Response is saved locally in sandbox</span>
                      <button
                        id={`btn-save-journal-${idx}`}
                        disabled={!journalEntries[idx]?.trim()}
                        onClick={() => handleSaveJournal(idx)}
                        className={`font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1 transition-colors cursor-pointer ${
                          !journalEntries[idx]?.trim()
                            ? 'text-slate-300 bg-slate-50 border border-slate-100'
                            : savedJournal[idx]
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {savedJournal[idx] ? (
                          <>✓ Journal Saved</>
                        ) : (
                          <>
                            <Send className="h-3 w-3" /> Save Response
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RETRIEVE AND RENDER EXPLICIT SYSTEM RECOMMENDATIONS */}
          <section className="space-y-6" id="alternative-system-recommendations">
            <h3 className="font-sans text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5.5 w-5.5 text-emerald-600" /> Custom-Tailored Alternatives
            </h3>
            <p className="text-slate-500 text-xs text-slate-500 mt-1">
              Actions you can execute immediately to offset duplicate clothing orders.
            </p>

            <div className="grid gap-5 md:grid-cols-3">
              {analysis.suggestions.map((s, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/30 p-5 space-y-3 shadow-2xs relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.type} Choice</span>
                    <h4 className="font-sans text-sm font-bold text-slate-800 mt-0.5">{s.title}</h4>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
