import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSearchTerm, setActiveTab, toggleFavorite } from '../../store/slices/marketSlice';
import { Search, Star, TrendingUp, TrendingDown } from 'lucide-react';

const MarketWatch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { symbols, searchTerm, activeTab } = useAppSelector(state => state.market);
  const { favorites } = useAppSelector(state => state.user);

  // Mock data for demonstration
  const mockSymbols = [
    { id: 'XAUUSD', name: 'XAUUSD', price: 1925.45, change: 12.34, changePercent: 0.64, high: 1930.12, low: 1920.33 },
    { id: 'EURUSD', name: 'EURUSD', price: 1.0845, change: -0.0023, changePercent: -0.21, high: 1.0868, low: 1.0842 },
    { id: 'GBPNZD', name: 'GBPNZD', price: 2.0456, change: 0.0089, changePercent: 0.44, high: 2.0467, low: 2.0423 },
    { id: 'BTCUSD', name: 'BTCUSD', price: 43567.89, change: 1234.56, changePercent: 2.91, high: 44000.00, low: 42500.00 },
    { id: 'WTI', name: 'WTI', price: 78.92, change: -1.45, changePercent: -1.80, high: 80.45, low: 78.33 },
    { id: 'GBPJPY', name: 'GBPJPY', price: 156.789, change: 0.456, changePercent: 0.29, high: 157.123, low: 156.234 },
    { id: 'AUDCAD', name: 'AUDCAD', price: 0.9123, change: -0.0034, changePercent: -0.37, high: 0.9167, low: 0.9101 },
    { id: 'XAGUSD', name: 'XAGUSD', price: 24.567, change: 0.789, changePercent: 3.32, high: 24.890, low: 23.456 },
  ];

  const filteredSymbols = useMemo(() => {
    let filtered = mockSymbols;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(symbol =>
        symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by favorites
    if (activeTab === 'favorites') {
      filtered = filtered.filter(symbol => favorites.includes(symbol.id));
    }

    return filtered;
  }, [searchTerm, activeTab, favorites]);

  const handleToggleFavorite = (symbolId: string) => {
    dispatch(toggleFavorite(symbolId));
  };

  return (
    <div className="bg-neutral rounded-xl border border-gray-700 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-h3 font-semibold text-white mb-4">Market Watch</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search eg: EUR/USD , BTC"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => dispatch(setActiveTab('favorites'))}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            FAVORITES
          </button>
          <button
            onClick={() => dispatch(setActiveTab('all'))}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ALL SYMBOLS
          </button>
        </div>
      </div>

      {/* Symbol List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSymbols.map((symbol) => (
          <div
            key={symbol.id}
            className="flex items-center justify-between p-3 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleToggleFavorite(symbol.id)}
                className={`p-1 rounded transition-colors ${
                  favorites.includes(symbol.id)
                    ? 'text-yellow-400 hover:text-yellow-300'
                    : 'text-gray-500 hover:text-gray-400'
                }`}
              >
                <Star className="w-4 h-4" fill={favorites.includes(symbol.id) ? 'currentColor' : 'none'} />
              </button>
              
              <div>
                <div className="text-white font-medium text-sm">{symbol.name}</div>
                <div className="text-gray-400 text-xs">
                  L: {symbol.low.toFixed(symbol.name.includes('JPY') ? 3 : 5)} --- H: {symbol.high.toFixed(symbol.name.includes('JPY') ? 3 : 5)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-white font-mono text-sm">
                {symbol.price.toFixed(symbol.name.includes('JPY') ? 3 : 5)}
              </div>
              <div className={`flex items-center justify-end space-x-1 text-xs ${
                symbol.change >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {symbol.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{symbol.changePercent.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                page === 1
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketWatch;