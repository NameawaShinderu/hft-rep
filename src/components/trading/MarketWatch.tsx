import React, { useMemo, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSearchTerm, setActiveTab, toggleFavorite, setSymbols } from '../../store/slices/marketSlice';
import { generateMarketData } from '../../services/mockData';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Search, Star, TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';

const MarketWatch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { symbols, searchTerm, activeTab } = useAppSelector(state => state.market);
  const { favorites } = useAppSelector(state => state.user);
  const { connection } = useWebSocket();
  const [dataSource, setDataSource] = useState<'websocket' | 'simulation'>('simulation');

  // Initialize market data and set up real-time updates
  useEffect(() => {
    // Load initial market data
    const initialData = generateMarketData();
    dispatch(setSymbols(initialData));

    let priceUpdateInterval: NodeJS.Timeout | null = null;

    // Use WebSocket if connected, otherwise fall back to price simulation
    if (connection.status === 'connected') {
      setDataSource('websocket');
      console.log('📡 Using WebSocket for real-time data');
      
      // WebSocket handles real-time updates automatically
      // No interval needed - data comes from WebSocket service
    } else {
      setDataSource('simulation');
      console.log('🔄 Using price simulation engine');
      
      // Fall back to price simulation (every 2 seconds for demo)
      priceUpdateInterval = setInterval(() => {
        const updatedData = generateMarketData();
        dispatch(setSymbols(updatedData));
      }, 2000);
    }

    return () => {
      if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
      }
    };
  }, [dispatch, connection.status]);

  const filteredSymbols = useMemo(() => {
    let filtered = symbols; // Use symbols from Redux store

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(symbol =>
        symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symbol.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by favorites
    if (activeTab === 'favorites') {
      filtered = filtered.filter(symbol => favorites.includes(symbol.id));
    }

    return filtered;
  }, [symbols, searchTerm, activeTab, favorites]);

  const handleToggleFavorite = (symbolId: string) => {
    dispatch(toggleFavorite(symbolId));
  };

  return (
    <div className="bg-neutral rounded-xl border border-gray-700 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-semibold text-white">Market Watch</h2>
          
          {/* Data Source Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs ${
              dataSource === 'websocket' 
                ? 'bg-success/20 text-success' 
                : 'bg-warning/20 text-warning'
            }`}>
              {dataSource === 'websocket' ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              <span className="font-medium">
                {dataSource === 'websocket' ? 'LIVE' : 'DEMO'}
              </span>
            </div>
          </div>
        </div>
        
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
        {filteredSymbols.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-center">
              {searchTerm ? `No symbols found for "${searchTerm}"` : 'No favorites added yet'}
            </p>
          </div>
        ) : (
          filteredSymbols.map((symbol) => {
            const priceDecimals = symbol.name.includes('JPY') ? 3 : 
                                 symbol.category === 'crypto' ? 2 : 
                                 symbol.category === 'stock' ? 2 : 5;
            
            return (
              <div
                key={symbol.id}
                className="group flex items-center justify-between p-3 hover:bg-gray-700/50 border-b border-gray-700/50 last:border-b-0 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleFavorite(symbol.id)}
                    className={`p-1 rounded transition-colors ${
                      favorites.includes(symbol.id)
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-gray-500 hover:text-gray-400 group-hover:text-gray-300'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={favorites.includes(symbol.id) ? 'currentColor' : 'none'} />
                  </button>
                  
                  <div>
                    <div className="text-white font-medium text-sm flex items-center space-x-2">
                      <span>{symbol.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-normal ${
                        symbol.category === 'forex' ? 'bg-blue-500/20 text-blue-300' :
                        symbol.category === 'crypto' ? 'bg-orange-500/20 text-orange-300' :
                        symbol.category === 'commodity' ? 'bg-amber-500/20 text-amber-300' :
                        symbol.category === 'index' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {symbol.category.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs flex items-center space-x-2">
                      <span>L: {symbol.low.toFixed(priceDecimals)}</span>
                      <span>•</span>
                      <span>H: {symbol.high.toFixed(priceDecimals)}</span>
                      <span>•</span>
                      <span>Vol: {symbol.volume.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className="text-white font-mono text-sm font-medium">
                    {symbol.price.toFixed(priceDecimals)}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`flex items-center space-x-1 text-xs font-medium ${
                      symbol.change >= 0 ? 'text-success' : 'text-danger'
                    }`}>
                      {symbol.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{symbol.changePercent.toFixed(2)}%</span>
                    </div>
                    <div className="text-gray-400 text-xs font-mono">
                      {symbol.change >= 0 ? '+' : ''}{symbol.change.toFixed(priceDecimals)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
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