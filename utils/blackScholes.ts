import { OptionParams, OptionResult } from '../types';

// Standard Normal cumulative distribution function
function CND(x: number): number {
  const a1 = 0.31938153;
  const a2 = -0.356563782;
  const a3 = 1.781477937;
  const a4 = -1.821255978;
  const a5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (x >= 0.0) {
    const t = 1.0 / (1.0 + p * x);
    return (1.0 - c * Math.exp(-x * x / 2.0) * t * (t * (t * (t * (t * a5 + a4) + a3) + a2) + a1));
  } else {
    const t = 1.0 / (1.0 - p * x);
    return (c * Math.exp(-x * x / 2.0) * t * (t * (t * (t * (t * a5 + a4) + a3) + a2) + a1));
  }
}

// Standard Normal Probability Density Function
function SND(x: number): number {
  return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

export const calculateBlackScholes = (params: OptionParams): OptionResult => {
  const { S, K, T, r, sigma } = params;

  // Handle edge case where T is 0 or negative
  if (T <= 0) {
    return {
      callPrice: Math.max(0, S - K),
      putPrice: Math.max(0, K - S),
      callDelta: S > K ? 1 : 0,
      putDelta: S < K ? -1 : 0,
      gamma: 0,
      callTheta: 0,
      putTheta: 0,
      vega: 0,
      callRho: 0,
      putRho: 0,
    };
  }

  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2.0) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const nd1 = CND(d1);
  const nd2 = CND(d2);
  const nnd1 = CND(-d1);
  const nnd2 = CND(-d2);
  const sd1 = SND(d1);

  // Prices
  const callPrice = S * nd1 - K * Math.exp(-r * T) * nd2;
  const putPrice = K * Math.exp(-r * T) * nnd2 - S * nnd1;

  // Greeks
  const callDelta = nd1;
  const putDelta = nd1 - 1;
  
  const gamma = sd1 / (S * sigma * Math.sqrt(T));
  
  const vega = (S * sd1 * Math.sqrt(T)) / 100; // Usually expressed per 1% vol change
  
  const callTheta = (- (S * sd1 * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * nd2) / 365; // Per day
  const putTheta = (- (S * sd1 * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * nnd2) / 365; // Per day

  const callRho = (K * T * Math.exp(-r * T) * nd2) / 100; // Per 1% rate change
  const putRho = (-K * T * Math.exp(-r * T) * nnd2) / 100;

  return {
    callPrice,
    putPrice,
    callDelta,
    putDelta,
    gamma,
    callTheta,
    putTheta,
    vega,
    callRho,
    putRho
  };
};