import React, { useState } from 'react';
import { OptionParams, OptionResult } from '../types';
import { GoogleGenAI } from '@google/genai';
import { Brain, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface GeminiAnalystProps {
  params: OptionParams;
  result: OptionResult;
}

const GeminiAnalyst: React.FC<GeminiAnalystProps> = ({ params, result }) => {
  const { t } = useLanguage();
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      // API key is assumed to be valid and available in process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        ${t.promptContext}
        
        Parameters:
        - Underlying Price: $${params.S}
        - Strike Price: $${params.K}
        - Time to Expiration: ${(params.T * 365).toFixed(1)} days
        - Volatility (IV): ${(params.sigma * 100).toFixed(1)}%
        - Risk Free Rate: ${(params.r * 100).toFixed(1)}%

        Calculated Greeks:
        - Call Delta: ${result.callDelta.toFixed(2)}
        - Call Theta (Daily Decay): ${result.callTheta.toFixed(3)}
        - Gamma: ${result.gamma.toFixed(4)}

        Task:
        1. Is this option In-the-money (ITM), At-the-money (ATM), or Out-of-the-money (OTM)?
        2. Explain the "Theta Burn". How much value will this option lose per day if the stock price stays flat? Is this high or low risk right now?
        3. Briefly mention the Vega risk (sensitivity to volatility changes).
        
        Keep it under 150 words. Format with Markdown. Use bullet points.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAnalysis(response.text || "No analysis generated.");
    } catch (err) {
      setError(t.error);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="text-pink-500" />
          {t.aiTitle}
        </h3>
        {!analysis && !loading && (
            <button 
                onClick={handleAnalyze}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-purple-900/20"
            >
                <Sparkles size={16} />
                {t.generateInsights}
            </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
          <Loader2 className="animate-spin" />
          {t.analyzing}
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {analysis && !loading && (
        <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700/50">
            <div className="prose prose-invert prose-sm max-w-none">
                {analysis.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 text-slate-300 leading-relaxed">
                        {line.replace(/\*\*/g, '')} 
                    </p>
                ))}
            </div>
             <button 
                onClick={handleAnalyze}
                className="mt-4 text-xs text-slate-500 hover:text-white underline"
            >
                {t.refresh}
            </button>
        </div>
      )}
    </div>
  );
};

export default GeminiAnalyst;
