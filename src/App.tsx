import React from 'react';
import Navigation, { TabId } from './components/Navigation';
import Home from './components/Home';
import Tracker from './components/Tracker';
import Dashboard from './components/Dashboard';
import Reflection from './components/Reflection';
import Education from './components/Education';
import Coach from './components/Coach';
import { Purchase } from './types';
import { Leaf, Info, Sparkles } from 'lucide-react';

const SEED_PURCHASES: Purchase[] = [
  {
    id: 'seed-p1',
    name: 'Classic Cotton T-Shirt',
    category: 'Clothing',
    brand: 'H&M',
    price: 12.00,
    date: '2026-05-10',
  },
  {
    id: 'seed-p2',
    name: 'Basic Organic Denim Jeans',
    category: 'Clothing',
    brand: 'Nudie Jeans',
    price: 110.00,
    date: '2026-05-14',
  },
  {
    id: 'seed-p3',
    name: 'Retro Canvas Sneakers',
    category: 'Shoes',
    brand: 'Veja',
    price: 140.00,
    date: '2026-05-18',
  },
  {
    id: 'seed-p4',
    name: 'Ribbed Cotton Tee',
    category: 'Clothing',
    brand: 'Zara',
    price: 18.00,
    date: '2026-05-20',
  },
  {
    id: 'seed-p5',
    name: 'Everyday Canvas Tote Bag',
    category: 'Bags',
    brand: 'Patagonia',
    price: 45.00,
    date: '2026-05-25',
  },
  {
    id: 'seed-p6',
    name: 'Classic Crewneck T-Shirt',
    category: 'Clothing',
    brand: 'H&M',
    price: 15.00,
    date: '2026-05-28',
  },
  {
    id: 'seed-p7',
    name: 'Slub Knit Tee',
    category: 'Clothing',
    brand: 'Uniqlo',
    price: 19.00,
    date: '2026-06-02',
  },
  {
    id: 'seed-p8',
    name: 'Eco-Brass Hoop Earrings',
    category: 'Accessories',
    brand: 'Mejuri',
    price: 68.00,
    date: '2026-05-30',
  }
];

export default function App() {
  const [activeTab, setActiveTab] = React.useState<TabId>('home');
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);

  // On mount, check if there's any local storage content, otherwise seed with preloaded triggers
  React.useEffect(() => {
    const stored = localStorage.getItem('ecoreflect_purchases_ledger_v1');
    if (stored) {
      try {
        setPurchases(JSON.parse(stored));
      } catch (err) {
        console.error('Failed reading purchase ledger from local state. Seeding default content.', err);
        setPurchases(SEED_PURCHASES);
        localStorage.setItem('ecoreflect_purchases_ledger_v1', JSON.stringify(SEED_PURCHASES));
      }
    } else {
      setPurchases(SEED_PURCHASES);
      localStorage.setItem('ecoreflect_purchases_ledger_v1', JSON.stringify(SEED_PURCHASES));
    }
  }, []);

  const savePurchases = (newPurchases: Purchase[]) => {
    setPurchases(newPurchases);
    localStorage.setItem('ecoreflect_purchases_ledger_v1', JSON.stringify(newPurchases));
  };

  const handleAddPurchase = (item: Omit<Purchase, 'id'>) => {
    const newItem: Purchase = {
      ...item,
      id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    const updated = [newItem, ...purchases];
    savePurchases(updated);
  };

  const handleEditPurchase = (item: Purchase) => {
    const updated = purchases.map((p) => (p.id === item.id ? item : p));
    savePurchases(updated);
  };

  const handleDeletePurchase = (id: string) => {
    const updated = purchases.filter((p) => p.id !== id);
    savePurchases(updated);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home onStartTracking={() => setActiveTab('tracker')} />;
      case 'tracker':
        return (
          <Tracker
            purchases={purchases}
            onAdd={handleAddPurchase}
            onEdit={handleEditPurchase}
            onDelete={handleDeletePurchase}
          />
        );
      case 'dashboard':
        return <Dashboard purchases={purchases} setActiveTab={setActiveTab} />;
      case 'reflection':
        return <Reflection purchases={purchases} />;
      case 'education':
        return <Education />;
      case 'chat':
        return <Coach />;
      default:
        return <Home onStartTracking={() => setActiveTab('tracker')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/35 flex flex-col justify-between" id="applet-main-layout">
      <div>
        {/* Navigation Layer */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Global info tag */}
        <div className="bg-emerald-600/5 border-b border-emerald-100/30 text-emerald-800 py-2.5 text-xs font-sans text-center px-4" id="sdg-global-banner">
          <div className="mx-auto max-w-7xl flex items-center justify-center gap-1.5 flex-wrap">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <strong>UN SDG Target 12.8:</strong> Actively monitoring overconsumption and fast-fashion duplicate triggers. Learn to build a circular wardrobe.
          </div>
        </div>

        {/* Primary Container Wrap */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Modern Botanical Footer */}
      <footer className="border-t border-slate-100 bg-white py-8 px-4" id="applet-botanical-footer">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs text-center md:text-left">
          
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-500" />
            <span className="font-sans font-bold text-slate-700">EcoReflect AI</span>
            <span className="text-[10px] text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded-md font-mono uppercase">V1.0.0</span>
          </div>

          <p className="max-w-md text-slate-400 font-sans leading-relaxed">
            Protecting ecological reserves by deploying interactive AI-calculus to prevent redundant checkouts and fast fashion landfills. UN SDG Target 12.8 compliant.
          </p>

          <div className="font-mono text-[10px]">
            © {new Date().getFullYear()} EcoReflect. All Rights Reserved.
          </div>

        </div>
      </footer>
    </div>
  );
}
