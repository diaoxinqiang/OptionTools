
import React, { useMemo } from 'react';
import { OptionResult, OptionParams } from '../types';
import { useLanguage } from '../utils/LanguageContext';
import { calculateBlackScholes } from '../utils/blackScholes';
import { CalendarClock } from 'lucide-react';

interface GreeksDisplayProps {
  params: OptionParams;
  result: OptionResult;
}

const GreeksDisplay: React.FC<GreeksDisplayProps> = ({ params, result }) => {
  const { t } = useLanguage();

  const cards = [
    { label: t.deltaCall, value: result.callDelta.toFixed(3), color: 'text-emerald-400', desc: t.deltaDesc },
    { label: t.deltaPut, value: result.putDelta.toFixed(3), color: 'text-red-400', desc: t.deltaDesc },
    { label: t.theta, value: result.callTheta.toFixed(3), color: 'text-purple-400', desc: t.thetaDesc },
    { label: t.gamma, value: result.gamma.toFixed(4), color: 'text-blue-400', desc: t.gammaDesc },
    { label: t.vega, value: result.vega.toFixed(3), color: 'text-orange-400', desc: t.vegaDesc },
  ];

  // Calculate Monthly Decay Schedule
  const monthlySchedule = useMemo(() => {
    const schedule = [];
    let currentT = params.T;
    let monthIndex = 1;
    
    // We start from the current price
    let prevCallPrice = result.callPrice;
    let prevPutPrice = result.putPrice;

    // Iterate in 30-day chunks (approx 0.082 years)
    while (currentT > 0.001) { 
        // Advance time by 30 days or calculate remaining if less than 30
        const step = 30 / 365;
        let nextT = currentT - step;
        let daysInStep = 30;

        if (nextT < 0) {
            daysInStep = Math.round(currentT * 365);
            nextT = 0;
        }

        // If less than 1 day left in final step, treat as 0
        if (daysInStep <= 0) break;

        // Calculate price at nextT
        // Ensure nextT is at least 0
        const futureResult = calculateBlackScholes({ ...params, T: Math.max(0, nextT) });
        
        // Decay for this specific period
        const callDecay = prevCallPrice - futureResult.callPrice;
        const putDecay = prevPutPrice - futureResult.putPrice;
        
        // % Loss for this specific period relative to start of this period
        const callPct = prevCallPrice > 0.001 ? (callDecay / prevCallPrice) * 100 : 0;
        const putPct = prevPutPrice > 0.001 ? (putDecay / prevPutPrice) * 100 : 0;

        // Cumulative Loss % relative to the INITIAL price (Today's price)
        // (Initial Price - End Price) / Initial Price
        const totalCallDecay = result.callPrice - futureResult.callPrice;
        const totalPutDecay = result.putPrice - futureResult.putPrice;

        const cumCallPct = result.callPrice > 0.001 ? (totalCallDecay / result.callPrice) * 100 : 0;
        const cumPutPct = result.putPrice > 0.001 ? (totalPutDecay / result.putPrice) * 100 : 0;

        schedule.push({
            label: nextT === 0 && daysInStep < 30 
                ? t.finalPeriod.replace('{days}', daysInStep.toString())
                : t.monthN.replace('{n}', monthIndex.toString()),
            callStart: prevCallPrice,
            callEnd: futureResult.callPrice,
            callDecay,
            callPct,
            cumCallPct,
            putStart: prevPutPrice,
            putEnd: futureResult.putPrice,
            putDecay,
            putPct,
            cumPutPct
        });

        prevCallPrice = futureResult.callPrice;
        prevPutPrice = futureResult.putPrice;
        currentT = nextT;
        monthIndex++;

        // Safety break for extreme T inputs to prevent infinite loops in rendering
        if (monthIndex > 36) break;
    }
    return schedule;
  }, [params, result, t]);


  return (
    <div className="space-y-6 mb-6">
      {/* Greeks Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow hover:border-slate-600 transition-colors">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              {card.label}
            </div>
            <div className={`text-xl font-bold font-mono ${card.color}`}>
              {card.value}
            </div>
            <div className="text-slate-600 text-[10px] mt-2 leading-tight">
              {card.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Decay Schedule Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 text-purple-400">
            <CalendarClock size={20} />
            <h3 className="font-semibold">{t.decayTitle}</h3>
        </div>
        
        <div className="overflow-x-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Call Table */}
                <div>
                    <h4 className="text-emerald-400 text-sm font-bold uppercase mb-3 flex justify-between border-b border-emerald-900/30 pb-2">
                        {t.callDecay}
                        <span className="text-emerald-500/50 text-xs font-normal">Current: ${result.callPrice.toFixed(2)}</span>
                    </h4>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-800/50">
                            <tr>
                                <th className="px-3 py-2 rounded-l-lg">{t.period}</th>
                                <th className="px-3 py-2 text-right">{t.startVal}</th>
                                <th className="px-3 py-2 text-right">{t.endVal}</th>
                                <th className="px-3 py-2 text-right">{t.lossAmt}</th>
                                <th className="px-3 py-2 text-right text-purple-400">{t.cumLossPct}</th>
                                <th className="px-3 py-2 text-right rounded-r-lg">{t.lossPct}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {monthlySchedule.map((row, idx) => (
                                <tr key={`call-${idx}`} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-3 py-2 font-medium text-slate-300">{row.label}</td>
                                    <td className="px-3 py-2 text-right text-slate-400 font-mono">${row.callStart.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right text-slate-400 font-mono">${row.callEnd.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right text-red-400 font-mono font-bold">-${row.callDecay.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right text-purple-400 font-mono font-bold">-{row.cumCallPct.toFixed(1)}%</td>
                                    <td className="px-3 py-2 text-right text-red-400 font-mono">-{row.callPct.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Put Table */}
                <div>
                     <h4 className="text-red-400 text-sm font-bold uppercase mb-3 flex justify-between border-b border-red-900/30 pb-2">
                        {t.putDecay}
                        <span className="text-red-500/50 text-xs font-normal">Current: ${result.putPrice.toFixed(2)}</span>
                    </h4>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-800/50">
                            <tr>
                                <th className="px-3 py-2 rounded-l-lg">{t.period}</th>
                                <th className="px-3 py-2 text-right">{t.startVal}</th>
                                <th className="px-3 py-2 text-right">{t.endVal}</th>
                                <th className="px-3 py-2 text-right">{t.lossAmt}</th>
                                <th className="px-3 py-2 text-right text-purple-400">{t.cumLossPct}</th>
                                <th className="px-3 py-2 text-right rounded-r-lg">{t.lossPct}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {monthlySchedule.map((row, idx) => (
                                <tr key={`put-${idx}`} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-3 py-2 font-medium text-slate-300">{row.label}</td>
                                    <td className="px-3 py-2 text-right text-slate-400 font-mono">${row.putStart.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right text-slate-400 font-mono">${row.putEnd.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right text-red-400 font-mono font-bold">-${row.putDecay.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right text-purple-400 font-mono font-bold">-{row.cumPutPct.toFixed(1)}%</td>
                                    <td className="px-3 py-2 text-right text-red-400 font-mono">-{row.putPct.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div className="mt-4 text-[10px] text-slate-500 text-center italic">
            * {t.decayNote}
        </div>
      </div>
    </div>
  );
};

export default GreeksDisplay;
