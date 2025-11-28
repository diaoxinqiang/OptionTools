export interface OptionParams {
  S: number; // Spot Price (Underlying)
  K: number; // Strike Price
  T: number; // Time to expiration (in years)
  r: number; // Risk-free interest rate (decimal)
  sigma: number; // Volatility (decimal)
}

export interface OptionResult {
  callPrice: number;
  putPrice: number;
  callDelta: number;
  putDelta: number;
  gamma: number;
  callTheta: number;
  putTheta: number;
  vega: number;
  callRho: number;
  putRho: number;
}

export interface ChartDataPoint {
  xValue: number; // Could be time or price
  callPrice: number;
  putPrice: number;
  intrinsicCall: number;
  intrinsicPut: number;
}

export enum SimulationType {
  TIME_DECAY = 'TIME_DECAY',
  PRICE_ACTION = 'PRICE_ACTION'
}