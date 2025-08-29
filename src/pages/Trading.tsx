import React, { useState, useEffect, useRef } from 'react';
import { useGetMarketDataQuery } from '../services/api';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Target,
  Shield,
  Calculator,
  BarChart3,
  Zap
} from 'lucide-react';

interface OrderFormData {
  symbol: string;
  orderType: 'buy' | 'sell';
  volume: number;
  stopLoss?: number;
  takeProfit?: number;
  orderMethod: 'market' | 'limit' | 'stop';
  limitPrice?: number;
}

const Trading: React.FC = () => {
  const { data: marketData } = useGetMarketDataQuery();
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    symbol: 'EURUSD',
    orderType: 'buy',
    volume: 1,
    orderMethod: 'market',
  });
  const [riskAmount, setRiskAmount] = useState(1000);

  // Chart refs
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Get selected symbol data
  const symbolData = marketData?.data.find(s => s.id === selectedSymbol);
  
  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#d1d5db',
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#485563',
      },
      timeScale: {
        borderColor: '#485563',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00D4AA',
      downColor: '#FF6B6B', 
      borderDownColor: '#FF6B6B',
      borderUpColor: '#00D4AA',
      wickDownColor: '#FF6B6B',
      wickUpColor: '#00D4AA',
    });

    // Generate sample candlestick data
    const generateCandlestickData = () => {
      const data = [];
      let basePrice = symbolData?.price || 1.0845;
      const now = Date.now();

      for (let i = 100; i >= 0; i--) {
        const time = (now - i * 60 * 1000) / 1000; // 1 minute intervals
        const volatility = 0.0005;
        
        const open = basePrice;
        const variation = (Math.random() - 0.5) * volatility * basePrice;
        const close = open + variation;
        const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.5;
        
        data.push({
          time: time as any,
          open,
          high,
          low,
          close,
        });
        
        basePrice = close;
      }
      return data;
    };

    candlestickSeries.setData(generateCandlestickData());

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [selectedSymbol, symbolData]);

  // Calculate position size based on risk
  const calculatePositionSize = () => {
    if (!symbolData || !orderForm.stopLoss) return orderForm.volume;
    
    const currentPrice = symbolData.price;
    const stopLoss = orderForm.stopLoss;
    const pipValue = 10; // Simplified pip value
    const riskInPips = Math.abs(currentPrice - stopLoss) * 10000;
    
    if (riskInPips === 0) return orderForm.volume;
    
    const positionSize = riskAmount / (riskInPips * pipValue);
    return Math.max(0.01, Math.min(100, positionSize));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', orderForm);
    // In a real app, this would send the order to the trading API
    alert(`Order placed: ${orderForm.orderType.toUpperCase()} ${orderForm.volume} ${orderForm.symbol}`);
  };

  if (!marketData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading trading interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-display font-semibold text-white mb-2">
          Advanced Trading
        </h1>
        <p className="text-gray-400">
          Professional trading interface with real-time charts and order management
        </p>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Chart Section - Takes up 3 columns */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* Symbol Selection */}
          <div className="bg-neutral rounded-xl border border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-medium text-white">Symbol Selection</h3>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-400">Real-time Data</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {marketData.data.slice(0, 12).map((symbol) => (
                <button
                  key={symbol.id}
                  onClick={() => {
                    setSelectedSymbol(symbol.id);
                    setOrderForm(prev => ({ ...prev, symbol: symbol.id }));
                  }}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedSymbol === symbol.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-sm font-medium">{symbol.name}</div>
                  <div className={`text-xs ${symbol.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                    {symbol.changePercent >= 0 ? '+' : ''}{symbol.changePercent.toFixed(2)}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trading Chart */}
          <div className="bg-neutral rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{selectedSymbol}</h3>
                  {symbolData && (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-white font-mono">
                        {symbolData.price.toFixed(selectedSymbol.includes('JPY') ? 3 : 5)}
                      </span>
                      <span className={`flex items-center ${symbolData.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                        {symbolData.changePercent >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {symbolData.changePercent >= 0 ? '+' : ''}{symbolData.changePercent.toFixed(2)}%
                      </span>
                      <span className="text-gray-400">
                        Spread: {(symbolData.ask - symbolData.bid).toFixed(5)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
                    <Activity className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
                    <Target className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div ref={chartContainerRef} className="w-full" />
          </div>
        </div>

        {/* Trading Panel - 1 column */}
        <div className="xl:col-span-1 space-y-4">
          
          {/* Quick Stats */}
          <div className="bg-neutral rounded-xl border border-gray-700 p-4">
            <h3 className="text-lg font-medium text-white mb-3">Account Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Balance</span>
                <span className="text-white font-mono">$50,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Equity</span>
                <span className="text-success font-mono">$52,340.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Free Margin</span>
                <span className="text-white font-mono">$48,765.30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">P&L</span>
                <span className="text-success font-mono">+$2,340.50</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-neutral rounded-xl border border-gray-700 p-4">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Place Order
            </h3>
            
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {/* Order Type */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setOrderForm(prev => ({ ...prev, orderType: 'buy' }))}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    orderForm.orderType === 'buy'
                      ? 'bg-success text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setOrderForm(prev => ({ ...prev, orderType: 'sell' }))}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    orderForm.orderType === 'sell'
                      ? 'bg-danger text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  SELL
                </button>
              </div>

              {/* Volume */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Volume</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={orderForm.volume}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Order Method */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Order Type</label>
                <select
                  value={orderForm.orderMethod}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, orderMethod: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="market">Market Order</option>
                  <option value="limit">Limit Order</option>
                  <option value="stop">Stop Order</option>
                </select>
              </div>

              {/* Stop Loss & Take Profit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Stop Loss
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    value={orderForm.stopLoss || ''}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Target className="w-4 h-4 inline mr-1" />
                    Take Profit
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    value={orderForm.takeProfit || ''}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Risk Calculator */}
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400 flex items-center">
                    <Calculator className="w-4 h-4 mr-1" />
                    Risk Calculator
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Amount:</span>
                    <input
                      type="number"
                      value={riskAmount}
                      onChange={(e) => setRiskAmount(parseFloat(e.target.value))}
                      className="w-20 px-2 py-1 bg-gray-700 rounded text-white text-right"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Suggested Size:</span>
                    <span className="text-white font-mono">{calculatePositionSize().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  orderForm.orderType === 'buy'
                    ? 'bg-success hover:bg-success/90 text-white'
                    : 'bg-danger hover:bg-danger/90 text-white'
                }`}
              >
                {orderForm.orderType === 'buy' ? 'BUY' : 'SELL'} {orderForm.symbol}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;