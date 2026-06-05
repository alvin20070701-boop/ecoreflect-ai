import React from 'react';
import { EDUCATION_TOPICS, EducationTopic } from '../data/education';
import { ShieldAlert, Droplets, ThermometerSun, Leaf, ArrowRight, Award, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Education() {
  const [selectedTopicId, setSelectedTopicId] = React.useState('fast-fashion');

  const activeTopic = React.useMemo(() => {
    return EDUCATION_TOPICS.find(topic => topic.id === selectedTopicId) || EDUCATION_TOPICS[0];
  }, [selectedTopicId]);

  return (
    <div className="space-y-10 pb-16" id="education-center-panel">
      {/* Page Header */}
      <div>
        <h1 className="font-sans text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Leaf className="h-7 w-7 text-emerald-600" /> Sustainability Education Center
        </h1>
        <p className="text-slate-500 text-sm">Empowering young consumers with high-fidelity environmental research to address Fast Fashion under UN SDG 12.8.</p>
      </div>

      {/* Infographic Topic selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="topic-tab-navigation">
        {EDUCATION_TOPICS.map((topic) => (
          <button
            key={topic.id}
            id={`topic-tab-${topic.id}`}
            onClick={() => setSelectedTopicId(topic.id)}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold tracking-tight shrink-0 transition-all border ${
              selectedTopicId === topic.id
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Main Infographic Panel Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTopicId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="grid gap-8 lg:grid-cols-12 items-start"
          id={`education-panel-${selectedTopicId}`}
        >
          {/* LEFT COLUMN: Main metrics and key facts */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title & subtitle */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-emerald-600 tracking-wider uppercase leading-none">
                {activeTopic.sdgMatch}
              </span>
              <h2 className="font-sans text-2xl font-bold text-slate-900">
                {activeTopic.title}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {activeTopic.subtitle}
              </p>
            </div>

            {/* INFOGRAPHIC BIG METRICS CIRCLES */}
            <div className="grid gap-4 sm:grid-cols-3" id="metric-infographic-banner">
              {activeTopic.metrics.map((m, idx) => (
                <div key={idx} className="bg-emerald-50/40 rounded-2xl border border-emerald-100/40 p-4 relative overflow-hidden flex flex-col justify-between text-center min-h-24">
                  <span className="font-sans text-3xl font-extrabold text-emerald-700 tracking-tight block">
                    {m.value}
                  </span>
                  <span className="font-sans text-[11px] font-semibold text-slate-600 block mt-1 leading-snug">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* KEY REALITIES & FACTS LIST */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-2xs" id="educational-facts">
              <h3 className="font-sans text-base font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-emerald-600" /> Essential Realities & Facts
              </h3>
              <ul className="space-y-3.5">
                {activeTopic.facts.map((fact, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-600 text-sm leading-relaxed text-left align-top">
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Environmental impacts cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-5" id="ecological-impact-panel">
              <div className="space-y-1">
                <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none block">ASSESSMENT</span>
                <h3 className="font-sans text-sm font-bold text-slate-800 uppercase tracking-wider">Ecological Footprints</h3>
              </div>

              <div className="space-y-4">
                {activeTopic.impacts.map((im, idx) => {
                  let badgeColors = 'bg-orange-50 text-orange-700';
                  if (idx === 1) badgeColors = 'bg-red-50 text-red-700';
                  
                  return (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-slate-100 space-y-2.5 shadow-2xs">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${badgeColors}`}>
                        {im.title}
                      </span>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {im.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CALL TO ACTION BUTTON BAR */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-6 text-white rounded-2xl shadow-sm space-y-4 text-center">
              <h4 className="font-sans text-sm font-bold">Apply This Knowledge!</h4>
              <p className="text-emerald-100 text-[11px] leading-relaxed">
                Take what you learned and crosscheck it against your recorded purchases to see how your score performs.
              </p>
              <div className="border-t border-emerald-800/50 pt-3">
                <span className="text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider leading-none">CONSUMPTION RULE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
