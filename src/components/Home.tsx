import { motion } from 'motion/react';
import { Leaf, ArrowRight, ShieldAlert, ThermometerSun, Droplets, BookOpen, Calendar } from 'lucide-react';

interface HomeProps {
  onStartTracking: () => void;
}

export default function Home({ onStartTracking }: HomeProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-16"
      id="home-page-container"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-radial from-emerald-50/70 via-emerald-50/10 to-transparent px-6 py-12 md:px-12 md:py-20 border border-emerald-100/30" id="hero-section">
        <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/40 blur-3xl"></div>
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-100">
            <Leaf className="h-3.5 w-3.5" />
            Empowering Modern Sustainable Lifestyles
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="font-sans text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
          >
            Reflect on Purchases.<br/>
            <span className="text-emerald-600">Restore the Planet.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mx-auto max-w-2xl text-slate-600 text-base md:text-lg leading-relaxed"
          >
            EcoReflect AI is your interactive platform to combat overconsumption and the ecological toll of Fast Fashion. Track purchases, identify redundancies, and learn how to construct a conscious wardrobe in perfect alignment with UN SDG Target 12.8.
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center pt-4">
            <button
              id="cta-start-tracking"
              onClick={onStartTracking}
              className="group flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/15 hover:bg-emerald-700 hover:shadow-lg transition-all"
            >
              Start Tracking My Consumption
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sustainable Development Goal 12.8 */}
      <motion.section variants={itemVariants} className="grid gap-6 md:grid-cols-12 items-center bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100" id="sdg-section">
        <div className="md:col-span-8 space-y-4">
          <span className="font-mono text-xs font-bold text-emerald-600 tracking-wider uppercase">United Nations Goal</span>
          <h2 className="font-sans text-2xl font-bold text-slate-800">Support UN Sustainable Development Goal 12.8</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Target 12.8 promotes lifestyle harmony: <em className="text-slate-800">"By 2030, ensure that people everywhere have the relevant information and awareness for sustainable development and lifestyles in harmony with nature."</em>
          </p>
          <p className="text-slate-500 text-xs sm:text-sm">
            By analyzing your repetitive purchases, EcoReflect AI targets the core habits of impulsiveness, transforming systemic transaction data into mindful personal reflection.
          </p>
        </div>
        <div className="md:col-span-4 flex justify-center md:justify-end">
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-emerald-600 text-white p-4 text-center shadow-md">
            <span className="font-sans text-xs font-semibold tracking-wider opacity-90">SDG TARGET</span>
            <span className="font-sans text-4xl font-black my-1">12.8</span>
            <span className="text-[9px] font-mono leading-tight tracking-tight uppercase">Responsible Consumption</span>
          </div>
        </div>
      </motion.section>

      {/* Critical Core Concept: What is Fast Fashion */}
      <section className="space-y-8" id="critical-concept-section">
        <motion.div variants={itemVariants} className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-sans text-3xl font-bold text-slate-800">What is Fast Fashion?</h2>
          <p className="text-slate-600 text-sm">
            Fast Fashion refers to clothes modeled on celebrity trends, cheaply produced at lightning speed, designed to satisfy temporary emotional whims rather than long-lasting utility.
          </p>
        </motion.div>

        {/* Environmental Impact Bento Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="environmental-impact-grid">
          
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-lg font-bold text-slate-800">Excessive Textile Waste</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Over 85% of manufactured textiles (nearly 21 billion tons yearly in the US alone) flow straight to incineration or landfills. Shoddy synthetic construction ensures they remain undecomposed for centuries.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-50 pt-4">
              <span className="font-mono text-xs font-semibold text-orange-600 uppercase tracking-widest">LANDFILL BURDEN</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <ThermometerSun className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-lg font-bold text-slate-800">Severe Carbon Emissions</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Apparel manufacturing produces roughly 10% of total global greenhouse gas emissions—more than international sea shipping and commercial airline flights combined.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-50 pt-4">
              <span className="font-mono text-xs font-semibold text-red-600 uppercase tracking-widest">CLIMATE ACCELERATION</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-lg font-bold text-slate-800">Irrational Resource Use</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Fast Fashion exhausts enormous reserves of freshwater. Growing raw chemical cotton for a single basic t-shirt drains approximately 2,700 liters of water—the equivalent of a human drinking supply for 900 days.
              </p>
            </div>
            <div className="mt-6 border-t border-slate-50 pt-4">
              <span className="font-mono text-xs font-semibold text-sky-600 uppercase tracking-widest">ECOLOGICAL DRAINAGE</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Sustainable Consumption Guide Quote Banner */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-emerald-950 p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
        id="quote-banner"
      >
        <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-800/10 rounded-full blur-2xl"></div>
        <div className="space-y-2">
          <p className="italic text-emerald-100 text-lg font-serif">
            "Buy less, choose well, make it last."
          </p>
          <p className="text-emerald-300 text-xs font-sans tracking-wide uppercase leading-none">
            — Vivienne Westwood, Fashion Pioneer & Environmentalist
          </p>
        </div>
        <button
          onClick={onStartTracking}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-950 hover:bg-emerald-50 transition-colors w-full md:w-auto justify-center"
        >
          Begin Track
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}
