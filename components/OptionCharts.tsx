
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { OptionParams, ChartDataPoint, SimulationType } from '../types';
import { calculateBlackScholes } from '../utils/blackScholes';
import { Timer, TrendingUp } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface OptionChartsProps {
  params: OptionParams;
}

const OptionCharts: React.FC<OptionChartsProps> = ({ params }) => {
  const { t } = useLanguage();
  const [simType, setSimType] = useState<SimulationType>(SimulationType.TIME_DECAY);

  const data = useMemo(() => {
    const points: ChartDataPoint[] = [];

    if (simType === SimulationType.TIME_DECAY) {
      // Generate points from T down to 0
      const steps = 50;
      for (let i = 0; i <= steps; i++) {
        const tStep = (params.T * i) / steps; 
        const currentT = params.T - (params.T * i) / steps;
        
        const res = calculateBlackScholes({ ...params, T: Math.max(0.0001, currentT) });
        
        points.push({
          xValue: parseFloat((currentT * 365).toFixed(1)), // Days
          callPrice: parseFloat(res.callPrice.toFixed(2)),
          putPrice: parseFloat(res.putPrice.toFixed(2)),
          intrinsicCall: Math.max(0, params.S - params.K),
          intrinsicPut: Math.max(0, params.K - params.S)
        });
      }
      return points.sort((a, b) => a.xValue - b.xValue);

    } else {
      // PRICE_ACTION Simulation
      // Range from -50% to +50% of S
      const startS = params.S * 0.5;
      const endS = params.S * 1.5;
      const steps = 60;
      const stepSize = (endS - startS) / steps;

      for (let i = 0; i <= steps; i++) {
        const currentS = startS + i * stepSize;
        const res = calculateBlackScholes({ ...params, S: currentS });
        points.push({
          xValue: parseFloat(currentS.toFixed(2)),
          callPrice: parseFloat(res.callPrice.toFixed(2)),
          putPrice: parseFloat(res.putPrice.toFixed(2)),
          intrinsicCall: parseFloat(Math.max(0, currentS - params.K).toFixed(2)),
          intrinsicPut: parseFloat(Math.max(0, params.K - currentS).toFixed(2))
        });
      }
      return points;
    }
  }, [params, simType]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl text-sm">
          <p className="text-slate-300 font-bold mb-2">
            {simType === SimulationType.TIME_DECAY ? `${t.daysLeft}: ${label}` : `${t.price}: $${label}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {simType === SimulationType.TIME_DECAY ? (
            <><Timer className="text-purple-400" /> {t.timeDecayCurve}</>
          ) : (
            <><TrendingUp className="text-emerald-400" /> {t.priceActionCurve}</>
          )}
        </h3>
        
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setSimType(SimulationType.TIME_DECAY)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              simType === SimulationType.TIME_DECAY
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.toggleTime}
          </button>
          <button
            onClick={() => setSimType(SimulationType.PRICE_ACTION)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              simType === SimulationType.PRICE_ACTION
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.togglePrice}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="xValue" 
              stroke="#94a3b8" 
              reversed={simType === SimulationType.TIME_DECAY}
              label={{ 
                value: simType === SimulationType.TIME_DECAY ? t.daysToExpiration : t.underlyingPrice, 
                position: 'insideBottom', 
                offset: -10,
                fill: '#94a3b8' 
              }} 
            />
            <YAxis stroke="#94a3b8" label={{ value: t.optionPrice, angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            
            {/* Call Line */}
            <Line 
              type="monotone" 
              dataKey="callPrice" 
              name={t.callValue} 
              stroke="#34d399" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6 }}
            />
            
            {/* Put Line */}
            <Line 
              type="monotone" 
              dataKey="putPrice" 
              name={t.putValue} 
              stroke="#f87171" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6 }}
            />

            {/* Current Reference for Price Action */}
            {simType === SimulationType.PRICE_ACTION && (
              <ReferenceLine x={params.S} stroke="#fbbf24" strokeDasharray="3 3" label={{ position: 'top', value: t.currentPrice, fill: '#fbbf24', fontSize: 12 }} />
            )}
             {/* Strike Reference for Price Action */}
             {simType === SimulationType.PRICE_ACTION && (
              <ReferenceLine x={params.K} stroke="#94a3b8" strokeDasharray="5 5" label={{ position: 'top', value: t.strike, fill: '#94a3b8', fontSize: 12 }} />
            )}

            {/* Current Reference for Time Decay */}
            {simType === SimulationType.TIME_DECAY && (
               <ReferenceLine x={params.T * 365} stroke="#fbbf24" strokeDasharray="3 3" label={{ position: 'top', value: t.today, fill: '#fbbf24', fontSize: 12 }} />
            )}

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OptionCharts;
