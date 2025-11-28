
import React from 'react';
import { OptionParams } from '../types';
import { Settings, Info } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface ControlPanelProps {
  params: OptionParams;
  setParams: React.Dispatch<React.SetStateAction<OptionParams>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams }) => {
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseFloat(e.target.value);
    const years = days / 365;
    setParams(prev => ({
      ...prev,
      T: years
    }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6 text-emerald-400">
        <Settings size={20} />
        <h2 className="text-xl font-bold">{t.settings}</h2>
      </div>

      <div className="space-y-6">
        {/* Underlying Price */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between">
            <span>{t.spotPrice}</span>
            <span className="text-white font-mono">{params.S}</span>
          </label>
          <input
            type="range"
            name="S"
            min="10"
            max="500"
            step="1"
            value={params.S}
            onChange={handleChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="mt-2 flex gap-2">
             <input 
                type="number"
                name="S"
                value={params.S}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
             />
          </div>
        </div>

        {/* Strike Price */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between">
            <span>{t.strikePrice}</span>
            <span className="text-white font-mono">{params.K}</span>
          </label>
          <input
            type="range"
            name="K"
            min="10"
            max="500"
            step="1"
            value={params.K}
            onChange={handleChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
           <div className="mt-2 flex gap-2">
             <input 
                type="number"
                name="K"
                value={params.K}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
             />
          </div>
        </div>

        {/* Time to Expiration */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between">
            <span>{t.timeToExp}</span>
            <span className="text-white font-mono">{params.T.toFixed(2)}</span>
          </label>
          <input
            type="range"
            name="T"
            min="0.01"
            max="2"
            step="0.01"
            value={params.T}
            onChange={handleChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="mt-2 flex gap-2">
             <input 
                type="number"
                value={(params.T * 365).toFixed(0)}
                onChange={handleDaysChange}
                min="4"
                max="730"
                step="1"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500"
             />
          </div>
           <div className="text-xs text-slate-500 mt-1 text-right">
             {t.approxDays.replace('{days}', (params.T * 365).toFixed(0))}
           </div>
        </div>

        {/* Volatility */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between">
            <span>{t.volatility}</span>
            <span className="text-white font-mono">{(params.sigma * 100).toFixed(1)}%</span>
          </label>
          <input
            type="range"
            name="sigma"
            min="0.05"
            max="2.0"
            step="0.01"
            value={params.sigma}
            onChange={handleChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="mt-2 flex gap-2">
             <input 
                type="number"
                name="sigma"
                value={params.sigma}
                onChange={handleChange}
                min="0.05"
                max="2.0"
                step="0.01"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-orange-500"
             />
          </div>
        </div>

        {/* Risk Free Rate */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between">
            <span>{t.riskFreeRate}</span>
            <span className="text-white font-mono">{(params.r * 100).toFixed(1)}%</span>
          </label>
          <input
            type="range"
            name="r"
            min="0"
            max="0.15"
            step="0.001"
            value={params.r}
            onChange={handleChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-gray-500"
          />
          <div className="mt-2 flex gap-2">
             <input 
                type="number"
                name="r"
                value={params.r}
                onChange={handleChange}
                min="0"
                max="0.15"
                step="0.001"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-gray-500"
             />
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400 border border-slate-700/50 flex gap-2">
            <Info className="flex-shrink-0" size={16} />
            <p>{t.paramInfo}</p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
