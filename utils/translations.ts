
export type Language = 'en' | 'zh';

export const translations = {
  en: {
    appTitle: "OptionFlow",
    appSubtitle: "Time Decay & Pricing Visualizer",
    callPrice: "Call Price",
    putPrice: "Put Price",
    spotPrice: "Spot Price ($)",
    strikePrice: "Strike Price ($)",
    timeToExp: "Time (Years)",
    volatility: "Volatility (σ)",
    riskFreeRate: "Risk-Free Rate (r)",
    approxDays: "Approx {days} Days",
    paramInfo: "Adjust parameters to see how the option premium decays over time or changes with price.",
    settings: "Parameters",
    
    // Greeks
    greeksTitle: "Greeks & Analysis",
    deltaCall: "Delta (Call)",
    deltaPut: "Delta (Put)",
    theta: "Theta (Daily)",
    gamma: "Gamma",
    vega: "Vega",
    rho: "Rho",
    
    deltaDesc: "Price change / $1 move",
    thetaDesc: "Daily time decay",
    gammaDesc: "Delta change rate",
    vegaDesc: "Sens. to 1% Vol change",

    // Decay
    decayTitle: "Monthly Decay Schedule",
    decayNote: "Projected value loss per month assuming price and volatility remain constant.",
    valueLoss: "Loss",
    percentage: "Loss %",
    retained: "End Value",
    callDecay: "Call Decay",
    putDecay: "Put Decay",
    period: "Period",
    startVal: "Start",
    endVal: "End",
    lossAmt: "Loss $",
    cumLossPct: "Total Loss %",
    lossPct: "Period Loss %",
    monthN: "Month {n}",
    finalPeriod: "Final ({days}d)",
    
    // Charts
    timeDecayCurve: "Time Decay (Theta Curve)",
    priceActionCurve: "Price Simulation (Delta Curve)",
    daysToExpiration: "Days to Expiration",
    underlyingPrice: "Underlying Price ($)",
    optionPrice: "Option Price ($)",
    daysLeft: "Days Left",
    callValue: "Call Value",
    putValue: "Put Value",
    currentPrice: "Current Price",
    strike: "Strike",
    today: "Today",
    toggleTime: "Time Decay",
    togglePrice: "Price Action",

    // AI
    aiTitle: "AI Risk Analyst",
    generateInsights: "Generate Insights",
    analyzing: "Analyzing...",
    error: "Analysis failed",
    refresh: "Refresh Analysis",
    promptContext: "You are a senior derivatives trader. Analyze this option scenario concisely for a retail user in English. Explain the risks."
  },
  zh: {
    appTitle: "OptionFlow 期权流",
    appSubtitle: "时间价值衰减与定价可视化",
    callPrice: "看涨期权 (Call)",
    putPrice: "看跌期权 (Put)",
    spotPrice: "标的价格 ($)",
    strikePrice: "行权价格 ($)",
    timeToExp: "到期时间 (年)",
    volatility: "波动率 (σ)",
    riskFreeRate: "无风险利率 (r)",
    approxDays: "约 {days} 天",
    paramInfo: "调整参数以观察期权权利金如何随时间衰减或随价格变化。",
    settings: "参数设置",

    // Greeks
    greeksTitle: "希腊值与分析",
    deltaCall: "Delta (看涨)",
    deltaPut: "Delta (看跌)",
    theta: "Theta (日衰减)",
    gamma: "Gamma (伽马)",
    vega: "Vega (维加)",
    rho: "Rho (罗)",

    deltaDesc: "股价变动$1的价格变化",
    thetaDesc: "每日时间价值损耗",
    gammaDesc: "Delta的变化速率",
    vegaDesc: "波动率变动1%的敏感度",

    // Decay
    decayTitle: "月度价值衰减明细",
    decayNote: "假设价格和波动率不变，预计每月的价值损耗。",
    valueLoss: "损失金额",
    percentage: "损失比例",
    retained: "期末残值",
    callDecay: "看涨期权",
    putDecay: "看跌期权",
    period: "时间段",
    startVal: "期初值",
    endVal: "期末值",
    lossAmt: "损耗额",
    cumLossPct: "累计损耗%",
    lossPct: "当期损耗率",
    monthN: "第 {n} 个月",
    finalPeriod: "最后 {days} 天",

    // Charts
    timeDecayCurve: "时间衰减 (Theta 曲线)",
    priceActionCurve: "价格模拟 (Delta 曲线)",
    daysToExpiration: "距离到期天数",
    underlyingPrice: "标的价格 ($)",
    optionPrice: "期权价格 ($)",
    daysLeft: "剩余天数",
    callValue: "看涨价值",
    putValue: "看跌价值",
    currentPrice: "当前价格",
    strike: "行权价",
    today: "今天",
    toggleTime: "时间衰减",
    togglePrice: "价格模拟",

    // AI
    aiTitle: "AI 风险分析师",
    generateInsights: "生成分析报告",
    analyzing: "正在分析...",
    error: "分析失败",
    refresh: "刷新分析",
    promptContext: "你是一位资深衍生品交易员。请用中文为散户投资者简明扼要地分析此期权方案。解释风险。"
  }
};
