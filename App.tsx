
import React, { useState, useMemo } from 'react';
import ControlPanel from './components/ControlPanel';
import OptionCharts from './components/OptionCharts';
import GreeksDisplay from './components/GreeksDisplay';
import GeminiAnalyst from './components/GeminiAnalyst';
import { OptionParams } from './types';
import { calculateBlackScholes } from './utils/blackScholes';
import { Activity, Globe } from 'lucide-react';
import { LanguageProvider, useLanguage } from './utils/LanguageContext';

// Main content separated to use the hook inside Provider
const AppContent: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  // Initial state: ATM Option, 120 days out
  const [params, setParams] = useState<OptionParams>({
    S: 100,      // Spot Price
    K: 100,      // Strike Price
    T: 120 / 365, // Time (approx 120 days)
    r: 0.0365,   // 3.65% Risk free rate
    sigma: 0.25  // 25% Volatility
  });

  // Calculate realtime results based on params
  const result = useMemo(() => calculateBlackScholes(params), [params]);

  const callPrice = result.callPrice.toFixed(2);
  const putPrice = result.putPrice.toFixed(2);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-2 rounded-lg">
              <Activity className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{t.appTitle}</h1>
              <p className="text-xs text-slate-400 hidden sm:block">{t.appSubtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:block text-right">
                <div className="text-xs text-slate-500 uppercase font-semibold">{t.callPrice}</div>
                <div className="text-2xl font-mono font-bold text-emerald-400">${callPrice}</div>
             </div>
             <div className="hidden md:block text-right">
                <div className="text-xs text-slate-500 uppercase font-semibold">{t.putPrice}</div>
                <div className="text-2xl font-mono font-bold text-red-400">${putPrice}</div>
             </div>
             
             {/* Language Toggle */}
             <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
             >
                <Globe size={14} />
                <span className="uppercase font-medium text-xs">{language}</span>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Controls - Spans 12 cols on mobile, 4 on desktop */}
          <div className="lg:col-span-3">
            <ControlPanel params={params} setParams={setParams} />
             {/* Mobile price display (shown below controls on mobile) */}
            <div className="mt-4 grid grid-cols-2 gap-4 md:hidden">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                    <div className="text-xs text-slate-500">{t.callPrice}</div>
                    <div className="text-xl font-bold text-emerald-400">${callPrice}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                    <div className="text-xs text-slate-500">{t.putPrice}</div>
                    <div className="text-xl font-bold text-red-400">${putPrice}</div>
                </div>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="lg:col-span-9">
            {/* Top Cards: Greeks & Decay */}
            <GreeksDisplay params={params} result={result} />

            {/* Chart Area */}
            <OptionCharts params={params} />

            {/* AI Analysis Area */}
            <GeminiAnalyst params={params} result={result} />
          </div>

        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;