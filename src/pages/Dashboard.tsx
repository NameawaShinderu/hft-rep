import React from 'react';
import { useGetUserDataQuery, useGetMarketDataQuery } from '../services/api';
import MarketWatch from '../components/trading/MarketWatch';
import MAMSystem from '../components/trading/MAMSystem';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  BarChart3
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: userData, isLoading: userLoading } = useGetUserDataQuery('user123');
  const { data: marketData } = useGetMarketDataQuery();

  // Calculate some quick stats
  const topGainer = marketData?.data.reduce((max, symbol) => 
    symbol.changePercent > max.changePercent ? symbol : max
  );

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-display font-semibold text-white mb-2">
          Trading Dashboard
        </h1>
        <p className="text-gray-400">
          Monitor markets and manage your trading portfolio
        </p>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Account Balance</h3>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-mono text-white">
            {userLoading ? (
              <div className="animate-pulse bg-gray-700 h-7 w-24 rounded"></div>
            ) : (
              `$${userData?.data.balance.toLocaleString() || '50,000.00'}`
            )}
          </div>
          <div className="text-xs text-success flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            +4.7% this month
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Today's P&L</h3>
            <Activity className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-mono text-success">
            {userLoading ? (
              <div className="animate-pulse bg-gray-700 h-7 w-20 rounded"></div>
            ) : (
              `+$${userData?.data.pl.toFixed(2) || '2,340.50'}`
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            3 active positions
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Top Gainer</h3>
            <BarChart3 className="w-4 h-4 text-success" />
          </div>
          <div className="text-lg font-medium text-white">
            {topGainer ? topGainer.name : 'Loading...'}
          </div>
          <div className="text-xs text-success flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            {topGainer ? `+${topGainer.changePercent.toFixed(2)}%` : '+0.00%'}
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Market Status</h3>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </div>
          <div className="text-lg font-medium text-white">
            Market Open
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {marketData?.data.length || 0} instruments active
          </div>
        </div>
      </div>

      {/* Quick Market Overview */}
      <div className="bg-neutral rounded-xl border border-gray-700 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Market Overview</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-success">
              <TrendingUp className="w-4 h-4" />
              <span>Winners: {marketData?.data.filter(s => s.changePercent > 0).length || 0}</span>
            </div>
            <div className="flex items-center space-x-2 text-danger">
              <TrendingDown className="w-4 h-4" />
              <span>Losers: {marketData?.data.filter(s => s.changePercent < 0).length || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marketData?.data.slice(0, 4).map((symbol) => (
            <div key={symbol.id} className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium text-sm">{symbol.name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  symbol.category === 'forex' ? 'bg-blue-500/20 text-blue-300' :
                  symbol.category === 'crypto' ? 'bg-orange-500/20 text-orange-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {symbol.category}
                </span>
              </div>
              <div className="text-white font-mono text-lg">
                {symbol.price.toFixed(symbol.name.includes('JPY') ? 3 : 5)}
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                symbol.changePercent >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {symbol.changePercent >= 0 ? 
                  <TrendingUp className="w-3 h-3" /> : 
                  <TrendingDown className="w-3 h-3" />
                }
                <span>{symbol.changePercent >= 0 ? '+' : ''}{symbol.changePercent.toFixed(2)}%</span>
              </div>
            </div>
          )) || Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-gray-800/30 rounded-lg p-3">
              <div className="animate-pulse">
                <div className="bg-gray-700 h-4 w-16 rounded mb-2"></div>
                <div className="bg-gray-700 h-6 w-20 rounded mb-1"></div>
                <div className="bg-gray-700 h-4 w-12 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Watch - Left Column */}
        <div className="lg:col-span-1">
          <MarketWatch />
        </div>
        
        {/* MAM System - Right Columns */}
        <div className="lg:col-span-2">
          <MAMSystem />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;