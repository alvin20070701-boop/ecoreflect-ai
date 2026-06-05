import React from 'react';
import { Purchase, Category, SustainabilityMetrics, DuplicateWarning } from '../types';
import { ShieldCheck, ShieldAlert, Sparkles, TrendingUp, TrendingDown, ArrowRight, HelpCircle, Recycle, Scissors, Repeat, ShoppingBag, Palette } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  purchases: Purchase[];
  setActiveTab: (tab: 'home' | 'tracker' | 'dashboard' | 'reflection' | 'education' | 'chat') => void;
}

export default function Dashboard({ purchases, setActiveTab }: DashboardProps) {
  
  // 1. DYNAMIC MATHEMATHICAL ALGORITHMS FOR METRICS
  const metrics = React.useMemo<SustainabilityMetrics>(() => {
    // Basic sums
    const monthlySpend: { [month: string]: number } = {};
    const categorySpend: { [category in Category]?: number } = {};
    const categoryCount: { [category in Category]?: number } = {};

    let totalSpend = 0;
    
    // Sort purchases by date to process chronologically
    const sorted = [...purchases].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((p) => {
      totalSpend += p.price;
      
      // Extract month YYYY-MM
      const m = p.date.substring(0, 7);
      monthlySpend[m] = (monthlySpend[m] || 0) + p.price;

      // Category metrics
      categorySpend[p.category] = (categorySpend[p.category] || 0) + p.price;
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });

    // Score deduction variables
    let score = 100;
    const factors: { name: string; impact: 'positive' | 'negative' | 'neutral'; desc: string }[] = [];

    if (purchases.length === 0) {
      return {
        score: 100,
        grade: 'Excellent',
        factors: [{ name: 'Conscious Entry', impact: 'positive' as const, desc: 'Zero purchases recorded! Your consumption footprint is perfectly clear.' }],
        monthlySpend,
        categorySpend,
        categoryCount,
        purchaseTrend: 'stable'
      };
    }

    // Deduction 1: Shopping Volume
    const itemsLast30Days = purchases.filter(p => {
      const pDate = new Date(p.date).getTime();
      const now = new Date('2026-06-04').getTime(); // Set relative to current constant time
      const diffDays = (now - pDate) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 30;
    });

    const itemsCount30 = itemsLast30Days.length;
    if (itemsCount30 <= 2) {
      score += 0; // Positive buffer
      factors.push({ name: 'Minimal Volume', impact: 'positive', desc: 'You purchase items very sparingly (less than 2 items in 30 days).' });
    } else if (itemsCount30 <= 4) {
      score -= 5;
      factors.push({ name: 'Moderate Volume', impact: 'neutral', desc: 'You average 3-4 purchases monthly, representing healthy, controlled needs.' });
    } else {
      const deduction = Math.min(30, (itemsCount30 - 4) * 6);
      score -= deduction;
      factors.push({ name: 'High Volume Excess', impact: 'negative', desc: `Logged ${itemsCount30} checkout transactions this past month, indicating high acquisition frequency.` });
    }

    // Deduction 2: Duplicate Purchase Chains (Using a smart matching algorithm)
    let duplicateGroupsCount = 0;
    const categoryGroups: { [key: string]: Purchase[] } = {};
    
    // Group items within 30 days of each other with similar descriptions or categories
    purchases.forEach(p => {
      const stem = p.name.toLowerCase()
        .replace(/(classic|basic|minimalist|premium|organic|everyday|standard|recycled)/g, '')
        .trim()
        .substring(0, 6); // Match first 6 letters for similarity e.g. "T-shir" vs "tshirt"
      
      const key = `${p.category}-${stem}`;
      if (!categoryGroups[key]) categoryGroups[key] = [];
      categoryGroups[key].push(p);
    });

    Object.values(categoryGroups).forEach(group => {
      if (group.length >= 2) {
        // Double check if at least two are within 30 days of each other
        let trigger = false;
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const d1 = new Date(group[i].date).getTime();
            const d2 = new Date(group[j].date).getTime();
            const diff = Math.abs(d1 - d2) / (1000 * 3600 * 24);
            if (diff <= 30) {
              trigger = true;
              break;
            }
          }
          if (trigger) break;
        }

        if (trigger) {
          duplicateGroupsCount += group.length;
        }
      }
    });

    if (duplicateGroupsCount === 0) {
      factors.push({ name: 'Unique Wardrobe Selections', impact: 'positive', desc: 'Zero duplicate garments or repeated category items detected. High utility choices!' });
    } else {
      const matchingDeduction = Math.min(40, duplicateGroupsCount * 8);
      score -= matchingDeduction;
      factors.push({ name: 'Repetitive Clothing Checkouts', impact: 'negative', desc: `Identified matching pieces or repetitive items purchased in close succession.` });
    }

    // Deduction 3: Financial Investment Footprint
    const spentLast30 = itemsLast30Days.reduce((acc, curr) => acc + curr.price, 0);
    if (spentLast30 > 500) {
      score -= 20;
      factors.push({ name: 'Elevated Clothing Capital', impact: 'negative', desc: `Spent $${spentLast30.toFixed(2)} on apparel in 30 days, exceeding mindful budgets.` });
    } else if (spentLast30 > 250) {
      score -= 10;
      factors.push({ name: 'Moderate Fashion Capital', impact: 'neutral', desc: `Spent $${spentLast30.toFixed(2)} in 30 days. Consider thrift-shopping or rental as alternatives.` });
    } else {
      factors.push({ name: 'Frugal Eco Budget', impact: 'positive', desc: `Low clothing expenditure ($${spentLast30.toFixed(2)} in last 30 days) signals high budget awareness.` });
    }

    // Clamp score
    score = Math.max(5, Math.min(100, score));

    let grade: 'Excellent' | 'Good' | 'Moderate' | 'Critical' = 'Good';
    if (score >= 85) grade = 'Excellent';
    else if (score >= 70) grade = 'Good';
    else if (score >= 50) grade = 'Moderate';
    else grade = 'Critical';

    // Trend analysis
    let purchaseTrend: 'up' | 'down' | 'stable' = 'stable';
    const monthKeys = Object.keys(monthlySpend).sort();
    if (monthKeys.length >= 2) {
      const lastMonth = monthlySpend[monthKeys[monthKeys.length - 1]];
      const prevMonth = monthlySpend[monthKeys[monthKeys.length - 2]];
      if (lastMonth > prevMonth * 1.1) purchaseTrend = 'up';
      else if (lastMonth < prevMonth * 0.9) purchaseTrend = 'down';
    }

    return {
      score,
      grade,
      factors,
      monthlySpend,
      categorySpend,
      categoryCount,
      purchaseTrend
    };
  }, [purchases]);

  // 2. DUP-RETECTION ENGINE FOR WARNING BADGES
  const duplicates = React.useMemo<DuplicateWarning[]>(() => {
    const warnings: DuplicateWarning[] = [];
    
    // Group by category first, then group by similar names
    const categoryMap: { [cat in Category]?: Purchase[] } = {};
    purchases.forEach(p => {
      if (!categoryMap[p.category]) categoryMap[p.category] = [];
      categoryMap[p.category]!.push(p);
    });

    Object.entries(categoryMap).forEach(([cat, catPurchases]) => {
      // Find matches in 30 days
      const sorted = [...catPurchases].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Cluster based on name similarities
      const textClusters: { [clusterId: string]: Purchase[] } = {};
      
      sorted.forEach(p => {
        // Helper to find common stems
        const normalized = p.name.toLowerCase();
        let stem = 'item';
        if (normalized.includes('t-shirt') || normalized.includes('shirt') || normalized.includes('tee')) {
          stem = 'T-shirts';
        } else if (normalized.includes('shoe') || normalized.includes('sneaker') || normalized.includes('boot')) {
          stem = 'Shoes';
        } else if (normalized.includes('jean') || normalized.includes('pant') || normalized.includes('denim')) {
          stem = 'Pants';
        } else if (normalized.includes('bag') || normalized.includes('pack') || normalized.includes('tote')) {
          stem = 'Bags';
        } else {
          // Fallback to Category
          stem = cat;
        }

        if (!textClusters[stem]) textClusters[stem] = [];
        textClusters[stem].push(p);
      });

      // For each cluster, check if they occur within 30 days
      Object.entries(textClusters).forEach(([stem, items]) => {
        if (items.length >= 2) {
          // Check timeframe
          const dates = items.map(it => new Date(it.date).getTime());
          const maxDate = Math.max(...dates);
          const minDate = Math.min(...dates);
          const spanDays = Math.ceil((maxDate - minDate) / (1000 * 3600 * 24));
          
          // Trigger if user bought them within 30 days
          // Also check absolute count
          if (items.length >= 2 && spanDays <= 30) {
            warnings.push({
              id: `${cat}-${stem}`,
              category: cat as Category,
              count: items.length,
              days: 30,
              items: items.map(it => it.name),
              warningMessage: `You have purchased similar ${stem} ${items.length} times in the last 30 days.`
            });
          }
        }
      });
    });

    return warnings;
  }, [purchases]);

  // Color mappings
  const getGradeStyles = (grade: string) => {
    switch (grade) {
      case 'Excellent': return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', stroke: '#059669' };
      case 'Good': return { text: 'text-green-600', bg: 'bg-green-50/50', border: 'border-green-100', stroke: '#10b981' };
      case 'Moderate': return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', stroke: '#d97706' };
      case 'Critical': return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', stroke: '#dc2626' };
      default: return { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', stroke: '#64748b' };
    }
  };

  // 3. ALTERNATIVE SUGGESTION CARDS (Triggered based on duplicates, otherwise standard)
  const recommendations = React.useMemo(() => {
    const hasDups = duplicates.length > 0;
    
    if (hasDups) {
      const dupItemType = duplicates[0].id.split('-')[1] || 'clothing';
      return [
        {
          id: 'alt1',
          title: `Creative Outfit Styling`,
          description: `Instead of buying another ${dupItemType.toLowerCase()}, challenge yourself to pair existing items in your closet in 5 completely new configurations. Check digital platforms for inspiration.`,
          icon: Palette,
          badge: 'Creative Combination',
          impact: '+15 Score Boost'
        },
        {
          id: 'alt2',
          title: `Direct Stitching & Repair`,
          description: `Extend the life of your older ${dupItemType.toLowerCase()} by sewing loose buttons, patching tears, or dyeing faded colors. Extending garment life by 9 months reduces carbon footprint by 30%.`,
          icon: Scissors,
          badge: 'Repair & Stitch',
          impact: 'Eco-Shedding High'
        },
        {
          id: 'alt3',
          title: `Community Wardrobe Swaps`,
          description: `Exchange clothes with friends or join a digital clothing swap group. Swap older, fully functional items for pieces new to you without triggering raw fast fashion resource demands.`,
          icon: Repeat,
          badge: 'Clothing Swap',
          impact: 'Zero virgin waste'
        },
        {
          id: 'alt4',
          title: `Pre-owned Thrift Selections`,
          description: `If you genuinely require another piece, promise to purchase high-quality second-hand items. Thrifting circulates pre-existing garments, preventing landfill clogging.`,
          icon: Recycle,
          badge: 'Second-Hand Support',
          impact: 'Saves 80% emissions'
        }
      ];
    } else {
      return [
        {
          id: 'alt1',
          title: 'The 30-Day Waiting Rule',
          description: 'Introduce a 30-day "quarantine" rule before completing any non-essential online checkout. Letting desires cool off resolves up to 70% of impulsive shopping trends.',
          icon: Repeat,
          badge: 'Rethink Habit',
          impact: 'Saves financial reserves'
        },
        {
          id: 'alt2',
          title: 'High-Quality Capsule Wardrobe',
          description: 'Aim to construct a capsule wardrobe of 25 highly durable, timeless garments that blend effortlessly. Disregard low-cost micro-trends that stretch and tear in the first laundry cycle.',
          icon: ShoppingBag,
          badge: 'Circular Choice',
          impact: 'Minimalist mindset'
        }
      ];
    }
  }, [duplicates]);

  const rawMonths = Object.keys(metrics.monthlySpend).sort();
  const spendValues = Object.values(metrics.monthlySpend) as number[];
  const maxSpend = spendValues.length ? Math.max(...spendValues) : 100;

  return (
    <div className="space-y-10 pb-16" id="dashboard-tab-panel">
      
      {/* Intro section */}
      <div>
        <h1 className="font-sans text-3xl font-bold text-slate-900">Consumption Dashboard</h1>
        <p className="text-slate-500 text-sm">Review carbon/textile insights, evaluate duplicates, and see your customized Sustainability Score.</p>
      </div>

      {/* DUPLICATE WARNING ALERT SECTION */}
      {duplicates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 flex flex-col md:flex-row gap-4 items-start shadow-sm"
          id="duplicate-alerts-banner"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <ShieldAlert className="h-5.5 w-5.5" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="font-sans font-bold text-amber-900 text-base">Duplicate Purchase Warning Detected</h3>
              <p className="text-amber-800 text-xs sm:text-sm mt-0.5">
                Our SDG 12.8 monitoring scanner identified repeating garments or accessories ordered close together.
              </p>
            </div>
            
            <div className="grid gap-2.5">
              {duplicates.map(dup => (
                <div key={dup.id} className="border border-amber-200/40 bg-white/70 rounded-xl p-3.5 text-xs text-amber-900 shadow-2xs font-sans font-semibold">
                  {dup.warningMessage}
                  <div className="mt-1.5 flex flex-wrap gap-1 font-mono text-[10px] text-amber-700/80 font-normal">
                    <span className="font-semibold">Repeating items: </span> {dup.items.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-amber-700/80 font-medium">
              We highly advise taking a moment in the <button onClick={() => setActiveTab('reflection')} className="underline font-bold text-emerald-800 hover:text-emerald-950">AI Reflection Center</button> to process what emotional or social drivers triggered these repetitive checkouts.
            </p>
          </div>
        </motion.div>
      )}

      {/* CORE SCORES BENTO ROW */}
      <div className="grid gap-6 md:grid-cols-12 items-stretch" id="core-bento-grid">
        
        {/* Visual Score Circle Ring */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:col-span-4 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">ECO CALCULUS</span>
            <h3 className="font-sans text-sm font-bold text-slate-800">Your Sustainability Score</h3>
          </div>

          {/* SVG Ring Gauge */}
          <div className="relative h-44 w-44 my-5 flex items-center justify-center">
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
              {/* Back Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Progress Circle with active colors */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={getGradeStyles(metrics.grade).stroke}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - metrics.score / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="font-sans text-4xl font-extrabold text-slate-900">{Math.round(metrics.score)}</span>
              <span className={`text-[11px] font-mono font-bold uppercase ${getGradeStyles(metrics.grade).text} tracking-widest mt-0.5`}>
                {metrics.grade}
              </span>
            </div>
          </div>

          {/* Scale range details */}
          <div className="text-slate-400 text-[10px] font-medium leading-none">
            Score range: <strong className="text-slate-600">0 - 100</strong>. Deduced by repeating items, frequency, and overall consumption volume.
          </div>
        </div>

        {/* Breakdown Factors of Sustainability Score */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:col-span-8 flex flex-col justify-between shadow-sm">
          <div className="space-y-1.5 mb-4">
            <h3 className="font-sans text-base font-bold text-slate-800">Sustainability Score Indicators</h3>
            <p className="text-slate-500 text-xs">A transparent overview of factors configuring your score of {Math.round(metrics.score)}/100.</p>
          </div>

          {/* Indicators list */}
          <div className="space-y-3.5 flex-1 justify-center flex flex-col">
            {metrics.factors.map((f, i) => (
              <div key={i} className="flex gap-3 items-start text-left">
                <span className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  f.impact === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                  f.impact === 'negative' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {f.impact === 'positive' ? '✓' : f.impact === 'negative' ? '!' : '•'}
                </span>
                <div>
                  <h4 className="font-sans text-xs font-bold text-slate-800 leading-none mb-1">{f.name}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-50 pt-4 flex justify-between items-center text-xs">
            <span className="text-slate-400">Trend Status:</span>
            <span className="font-bold flex items-center gap-1">
              {metrics.purchaseTrend === 'down' ? (
                <span className="text-emerald-600 flex items-center gap-0.5">
                  <TrendingDown className="h-4 w-4" /> Downward Trend (Healthy Reduction)
                </span>
              ) : metrics.purchaseTrend === 'up' ? (
                <span className="text-red-500 flex items-center gap-0.5">
                  <TrendingUp className="h-4 w-4" /> Upward Trend (Consumption Crest)
                </span>
              ) : (
                <span className="text-slate-600">Stable Consumption</span>
              )}
            </span>
          </div>

        </div>
      </div>

      {/* METRIC CHARTS AREA */}
      <div className="grid gap-6 md:grid-cols-2" id="metric-charts-container">
        
        {/* Spending Monthly Bar Chart (SVG) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-sans text-base font-bold text-slate-800">Monthly Spending History</h3>
            <p className="text-slate-500 text-xs mb-4">A visual ledger of expenditures logged monthly.</p>
          </div>

          {rawMonths.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-slate-400 text-xs">
              No purchases logged to map spending timeline charts.
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {/* Bars rendering */}
              <div className="flex h-36 items-end justify-between px-2 gap-4">
                {rawMonths.map((m) => {
                  const val = metrics.monthlySpend[m] || 0;
                  const ratio = Math.max(10, (val / maxSpend) * 100);
                  return (
                    <div key={m} className="flex flex-col items-center flex-1 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-slate-600">${Math.round(val)}</span>
                      <div className="w-full bg-slate-50 hover:bg-emerald-50 rounded-lg h-24 relative overflow-hidden transition-colors">
                        <div
                          style={{ height: `${ratio}%` }}
                          className="w-full bg-emerald-600 rounded-b-md absolute bottom-0 transition-all duration-1000 ease-out"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{m.replace(/^\d{4}-/, '')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Category Breakdown list (SVG Progress style) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-sans text-base font-bold text-slate-800">Category Proportions</h3>
            <p className="text-slate-500 text-xs mb-4">Analysis of expenditures divided by clothing vs boots or accessories.</p>
          </div>

          {purchases.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-slate-400 text-xs">
              No data available to formulate proportions.
            </div>
          ) : (
            <div className="space-y-3.5 py-2">
              {(['Clothing', 'Shoes', 'Accessories', 'Bags', 'Other'] as Category[]).map((cat) => {
                const count = metrics.categoryCount[cat] || 0;
                const cost = metrics.categorySpend[cat] || 0;
                const totalApparelCost = purchases.reduce((acc, curr) => acc + curr.price, 0);
                const percent = totalApparelCost ? (cost / totalApparelCost) * 100 : 0;
                
                let progressColor = 'bg-emerald-600';
                if (cat === 'Shoes') progressColor = 'bg-amber-500';
                if (cat === 'Accessories') progressColor = 'bg-purple-500';
                if (cat === 'Bags') progressColor = 'bg-sky-500';

                return (
                  <div key={cat} className="space-y-1" id={`category-breakdown-${cat.toLowerCase()}`}>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 flex items-center gap-1">
                        {cat} <span className="text-[10px] text-slate-400 font-normal">({count} items)</span>
                      </span>
                      <span className="text-slate-900">${cost.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">({Math.round(percent)}%)</span></span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full ${progressColor} rounded-full transition-all duration-1000 ease-out`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FREQUENT PURCHASES SUMMARY & RECOMMENDED ALTERNATIVES PANEL */}
      <section className="space-y-6" id="sustainable-suggestions-panel">
        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
          <h3 className="font-sans text-xl font-bold text-slate-930">Sustainable Action Suggestions</h3>
          {duplicates.length > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-semibold tracking-wider font-mono uppercase rounded-full border border-emerald-100">
              <Recycle className="h-3.5 w-3.5" /> Customized Alternatives
            </span>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div key={rec.id} className="rounded-xl border border-emerald-50/70 bg-gradient-to-br from-white to-emerald-50/10 p-5 flex gap-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-sans text-sm font-bold text-slate-800">{rec.title}</h4>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-100/40 text-emerald-800 border border-emerald-100/30 font-semibold uppercase">{rec.badge}</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{rec.description}</p>
                  <p className="text-[10px] font-mono text-emerald-700/80 font-bold flex items-center gap-1 mt-1">
                    <Sparkles className="h-3 w-3" /> Impact: {rec.impact}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
