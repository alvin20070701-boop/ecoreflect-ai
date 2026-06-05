import React from 'react';
import { Leaf, ShoppingBag, BarChart3, Brain, BookOpen, MessageSquare, Menu, X } from 'lucide-react';

export type TabId = 'home' | 'tracker' | 'dashboard' | 'reflection' | 'education' | 'chat';

interface NavigationProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', name: 'Home', icon: Leaf },
    { id: 'tracker', name: 'Tracker', icon: ShoppingBag },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'reflection', name: 'AI Reflection', icon: Brain },
    { id: 'education', name: 'Education', icon: BookOpen },
    { id: 'chat', name: 'AI Coach', icon: MessageSquare },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')} id="nav-brand">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform hover:scale-105">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <span className="font-sans font-bold text-lg tracking-tight text-slate-800">
              EcoReflect <span className="text-emerald-600">AI</span>
            </span>
            <div className="text-[10px] font-mono text-emerald-600 font-medium tracking-widest leading-none">
              SDG 12.8 COMPLIANT
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" id="nav-desktop">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-emerald-50 bg-white" id="nav-mobile-dropdown">
          <div className="space-y-1 px-3 py-4 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-tab-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
