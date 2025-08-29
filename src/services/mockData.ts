import { Symbol } from '../types';

// Comprehensive financial instruments database
export const FINANCIAL_INSTRUMENTS: Omit<Symbol, 'price' | 'bid' | 'ask' | 'change' | 'changePercent' | 'high' | 'low' | 'volume' | 'lastUpdate'>[] = [
  // Major Forex Pairs
  { id: 'EURUSD', name: 'EUR/USD', displayName: 'Euro / US Dollar', category: 'forex' },
  { id: 'GBPUSD', name: 'GBP/USD', displayName: 'British Pound / US Dollar', category: 'forex' },
  { id: 'USDJPY', name: 'USD/JPY', displayName: 'US Dollar / Japanese Yen', category: 'forex' },
  { id: 'USDCHF', name: 'USD/CHF', displayName: 'US Dollar / Swiss Franc', category: 'forex' },
  { id: 'AUDUSD', name: 'AUD/USD', displayName: 'Australian Dollar / US Dollar', category: 'forex' },
  { id: 'USDCAD', name: 'USD/CAD', displayName: 'US Dollar / Canadian Dollar', category: 'forex' },
  { id: 'NZDUSD', name: 'NZD/USD', displayName: 'New Zealand Dollar / US Dollar', category: 'forex' },
  
  // Cross Currency Pairs
  { id: 'EURGBP', name: 'EUR/GBP', displayName: 'Euro / British Pound', category: 'forex' },
  { id: 'EURJPY', name: 'EUR/JPY', displayName: 'Euro / Japanese Yen', category: 'forex' },
  { id: 'GBPJPY', name: 'GBP/JPY', displayName: 'British Pound / Japanese Yen', category: 'forex' },
  { id: 'AUDCAD', name: 'AUD/CAD', displayName: 'Australian Dollar / Canadian Dollar', category: 'forex' },
  { id: 'AUDNZD', name: 'AUD/NZD', displayName: 'Australian Dollar / New Zealand Dollar', category: 'forex' },
  { id: 'GBPNZD', name: 'GBP/NZD', displayName: 'British Pound / New Zealand Dollar', category: 'forex' },
  { id: 'EURCHF', name: 'EUR/CHF', displayName: 'Euro / Swiss Franc', category: 'forex' },
  { id: 'GBPCHF', name: 'GBP/CHF', displayName: 'British Pound / Swiss Franc', category: 'forex' },

  // Cryptocurrencies  
  { id: 'BTCUSD', name: 'BTC/USD', displayName: 'Bitcoin / US Dollar', category: 'crypto' },
  { id: 'ETHUSD', name: 'ETH/USD', displayName: 'Ethereum / US Dollar', category: 'crypto' },
  { id: 'XRPUSD', name: 'XRP/USD', displayName: 'Ripple / US Dollar', category: 'crypto' },
  { id: 'ADAUSD', name: 'ADA/USD', displayName: 'Cardano / US Dollar', category: 'crypto' },
  { id: 'DOTUSD', name: 'DOT/USD', displayName: 'Polkadot / US Dollar', category: 'crypto' },
  { id: 'LINKUSD', name: 'LINK/USD', displayName: 'Chainlink / US Dollar', category: 'crypto' },
  { id: 'LTCUSD', name: 'LTC/USD', displayName: 'Litecoin / US Dollar', category: 'crypto' },
  { id: 'BCHUSD', name: 'BCH/USD', displayName: 'Bitcoin Cash / US Dollar', category: 'crypto' },  
  // Commodities
  { id: 'XAUUSD', name: 'XAU/USD', displayName: 'Gold / US Dollar', category: 'commodity' },
  { id: 'XAGUSD', name: 'XAG/USD', displayName: 'Silver / US Dollar', category: 'commodity' },
  { id: 'WTI', name: 'WTI', displayName: 'West Texas Intermediate Oil', category: 'commodity' },
  { id: 'BRENT', name: 'BRENT', displayName: 'Brent Crude Oil', category: 'commodity' },
  { id: 'NATGAS', name: 'NATGAS', displayName: 'Natural Gas', category: 'commodity' },
  { id: 'COPPER', name: 'COPPER', displayName: 'Copper Futures', category: 'commodity' },
  { id: 'PLATINUM', name: 'PLATINUM', displayName: 'Platinum / US Dollar', category: 'commodity' },
  { id: 'PALLADIUM', name: 'PALLADIUM', displayName: 'Palladium / US Dollar', category: 'commodity' },

  // Major Stock Indices
  { id: 'SPX500', name: 'SPX500', displayName: 'S&P 500 Index', category: 'index' },
  { id: 'NAS100', name: 'NAS100', displayName: 'NASDAQ 100 Index', category: 'index' },
  { id: 'DJI30', name: 'DJI30', displayName: 'Dow Jones Industrial Average', category: 'index' },
  { id: 'GER40', name: 'GER40', displayName: 'German DAX Index', category: 'index' },
  { id: 'UK100', name: 'UK100', displayName: 'FTSE 100 Index', category: 'index' },
  { id: 'FRA40', name: 'FRA40', displayName: 'CAC 40 Index', category: 'index' },
  { id: 'JPN225', name: 'JPN225', displayName: 'Nikkei 225 Index', category: 'index' },
  { id: 'AUS200', name: 'AUS200', displayName: 'ASX 200 Index', category: 'index' },

  // Major Stocks
  { id: 'AAPL', name: 'AAPL', displayName: 'Apple Inc.', category: 'stock' },
  { id: 'MSFT', name: 'MSFT', displayName: 'Microsoft Corporation', category: 'stock' },
  { id: 'GOOGL', name: 'GOOGL', displayName: 'Alphabet Inc.', category: 'stock' },
  { id: 'AMZN', name: 'AMZN', displayName: 'Amazon.com Inc.', category: 'stock' },
  { id: 'TSLA', name: 'TSLA', displayName: 'Tesla Inc.', category: 'stock' },
  { id: 'META', name: 'META', displayName: 'Meta Platforms Inc.', category: 'stock' },
  { id: 'NVDA', name: 'NVDA', displayName: 'NVIDIA Corporation', category: 'stock' },
  { id: 'NFLX', name: 'NFLX', displayName: 'Netflix Inc.', category: 'stock' },
  { id: 'AMD', name: 'AMD', displayName: 'Advanced Micro Devices', category: 'stock' },
  { id: 'INTC', name: 'INTC', displayName: 'Intel Corporation', category: 'stock' },
];
// Base prices for realistic simulation
const BASE_PRICES: Record<string, number> = {
  // Forex pairs
  'EURUSD': 1.0845, 'GBPUSD': 1.2634, 'USDJPY': 148.23, 'USDCHF': 0.8756,
  'AUDUSD': 0.6543, 'USDCAD': 1.3567, 'NZDUSD': 0.5987,
  'EURGBP': 0.8589, 'EURJPY': 160.78, 'GBPJPY': 187.45,
  'AUDCAD': 0.8876, 'AUDNZD': 1.0928, 'GBPNZD': 2.1098,
  'EURCHF': 0.9498, 'GBPCHF': 1.1067,

  // Cryptocurrencies  
  'BTCUSD': 43567.89, 'ETHUSD': 2634.56, 'XRPUSD': 0.5234,
  'ADAUSD': 0.3456, 'DOTUSD': 7.8901, 'LINKUSD': 15.678,
  'LTCUSD': 89.45, 'BCHUSD': 234.67,

  // Commodities
  'XAUUSD': 1925.45, 'XAGUSD': 24.567, 'WTI': 78.92, 'BRENT': 82.14,
  'NATGAS': 3.456, 'COPPER': 8234.56, 'PLATINUM': 934.56, 'PALLADIUM': 1123.45,

  // Indices
  'SPX500': 4567.89, 'NAS100': 15678.45, 'DJI30': 34567.12, 'GER40': 15987.34,
  'UK100': 7654.32, 'FRA40': 7234.56, 'JPN225': 32456.78, 'AUS200': 7123.45,

  // Stocks
  'AAPL': 178.23, 'MSFT': 334.56, 'GOOGL': 134.78, 'AMZN': 145.67,
  'TSLA': 234.89, 'META': 298.45, 'NVDA': 456.78, 'NFLX': 398.12,
  'AMD': 112.34, 'INTC': 45.67,
};

// Spread configurations for different asset types
const SPREADS: Record<string, number> = {
  // Forex - typical spreads in pips
  forex: 0.00015, // 1.5 pips for majors
  
  // Crypto - wider spreads
  crypto: 0.001, // 0.1%
  
  // Commodities
  commodity: 0.0005, // 0.05%
  
  // Indices 
  index: 0.0002, // 0.02%
  
  // Stocks
  stock: 0.0001, // 0.01%
};

// Price simulation state for realistic market movements
class PriceSimulator {
  private currentPrices: Map<string, number> = new Map();
  private priceHistory: Map<string, number[]> = new Map();
  private highLow: Map<string, { high: number; low: number }> = new Map();
  private volatility: Map<string, number> = new Map();

  constructor() {
    this.initializePrices();
    this.initializeVolatility();
  }

  private initializePrices(): void {
    Object.entries(BASE_PRICES).forEach(([symbolId, basePrice]) => {
      this.currentPrices.set(symbolId, basePrice);
      this.priceHistory.set(symbolId, [basePrice]);
      this.highLow.set(symbolId, { high: basePrice, low: basePrice });
    });
  }

  private initializeVolatility(): void {
    FINANCIAL_INSTRUMENTS.forEach(instrument => {
      // Set realistic volatility based on asset category
      let vol: number;
      switch (instrument.category) {
        case 'forex': vol = 0.0001; break;      // 0.01% typical forex volatility
        case 'crypto': vol = 0.003; break;      // 0.3% high crypto volatility  
        case 'commodity': vol = 0.0015; break; // 0.15% commodity volatility
        case 'index': vol = 0.0008; break;     // 0.08% index volatility
        case 'stock': vol = 0.002; break;      // 0.2% individual stock volatility
        default: vol = 0.001;
      }
      this.volatility.set(instrument.id, vol);
    });
  }

  // Generate realistic price movement using Geometric Brownian Motion
  private generatePriceChange(symbolId: string): number {
    const vol = this.volatility.get(symbolId) || 0.001;
    const drift = 0.0001; // Small positive drift
    const dt = 1; // Time step
    
    // Random walk with normal distribution
    const random = (Math.random() - 0.5) * 2; // Range: -1 to 1
    const priceChange = drift * dt + vol * Math.sqrt(dt) * random;
    
    return priceChange;
  }

  // Update all symbol prices with realistic movements
  updatePrices(): Symbol[] {
    const updatedSymbols: Symbol[] = [];

    FINANCIAL_INSTRUMENTS.forEach(instrument => {
      const currentPrice = this.currentPrices.get(instrument.id);
      if (!currentPrice) return;

      const priceChange = this.generatePriceChange(instrument.id);
      const newPrice = currentPrice * (1 + priceChange);
      
      // Update current price
      this.currentPrices.set(instrument.id, newPrice);
      
      // Update price history (keep last 100 points for sparklines)
      const history = this.priceHistory.get(instrument.id) || [];
      history.push(newPrice);
      if (history.length > 100) {
        history.shift();
      }
      this.priceHistory.set(instrument.id, history);
      
      // Update high/low tracking
      const currentHighLow = this.highLow.get(instrument.id);
      if (currentHighLow) {
        const updatedHighLow = {
          high: Math.max(currentHighLow.high, newPrice),
          low: Math.min(currentHighLow.low, newPrice),
        };
        this.highLow.set(instrument.id, updatedHighLow);
      }
      
      // Calculate bid/ask spread
      const spreadPercent = SPREADS[instrument.category] || 0.0001;
      const spread = newPrice * spreadPercent;
      const bid = newPrice - spread / 2;
      const ask = newPrice + spread / 2;
      
      // Calculate change from base price
      const basePrice = BASE_PRICES[instrument.id];
      const change = newPrice - basePrice;
      const changePercent = (change / basePrice) * 100;
      
      // Generate volume (more active during market hours)
      const hour = new Date().getHours();
      const marketHours = (hour >= 8 && hour <= 17) ? 1.5 : 0.7; // Higher volume during market hours
      const baseVolume = instrument.category === 'forex' ? 100000 : 
                        instrument.category === 'crypto' ? 5000 :
                        instrument.category === 'stock' ? 50000 : 25000;
      const volume = Math.floor(baseVolume * marketHours * (0.5 + Math.random()));

      const symbolData: Symbol = {
        ...instrument,
        price: newPrice,
        bid,
        ask,
        change,
        changePercent,
        high: this.highLow.get(instrument.id)?.high || newPrice,
        low: this.highLow.get(instrument.id)?.low || newPrice,
        volume,
        lastUpdate: new Date(),
        sparklineData: [...(this.priceHistory.get(instrument.id) || [])],
      };

      updatedSymbols.push(symbolData);
    });

    return updatedSymbols;
  }

  // Reset daily high/low values (call at market open)
  resetDailyHighLow(): void {
    this.currentPrices.forEach((price, symbolId) => {
      this.highLow.set(symbolId, { high: price, low: price });
    });
  }

  // Get current price for a specific symbol
  getCurrentPrice(symbolId: string): number | null {
    return this.currentPrices.get(symbolId) || null;
  }

  // Get price history for sparklines
  getPriceHistory(symbolId: string): number[] {
    return this.priceHistory.get(symbolId) || [];
  }
}

// Global price simulator instance
export const priceSimulator = new PriceSimulator();

// Export function to get updated market data
export const generateMarketData = (): Symbol[] => {
  return priceSimulator.updatePrices();
};

// Export function to reset daily values
export const resetDailyData = (): void => {
  priceSimulator.resetDailyHighLow();
};

// Export function for individual symbol data
export const getSymbolData = (symbolId: string): Symbol | null => {
  const symbols = generateMarketData();
  return symbols.find(s => s.id === symbolId) || null;
};