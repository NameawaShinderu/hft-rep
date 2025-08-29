import React, { useState } from 'react';
import { useGetMarketDataQuery, useGetSignalProvidersQuery, useGetUserDataQuery } from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  Award,
  Target,
  PieChart,
  BarChart3,
  Star,
  Crown,
  Zap
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { data: marketData } = useGetMarketDataQuery();
  const { data: providersData } = useGetSignalProvidersQuery();
  const { data: userData } = useGetUserDataQuery('user123');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');

  // Calculate market statistics
  const marketStats = React.useMemo(() => {
    if (!marketData?.data) return null;

    const symbols = marketData.data;
    const winners = symbols.filter(s => s.changePercent > 0);
    const losers = symbols.filter(s => s.changePercent < 0);
    const topGainer = symbols.reduce((max, s) => s.changePercent > max.changePercent ? s : max);
    const topLoser = symbols.reduce((min, s) => s.changePercent < min.changePercent ? s : min);

    return {
      totalInstruments: symbols.length,
      winners: winners.length,
      losers: losers.length,
      unchanged: symbols.length - winners.length - losers.length,
      topGainer,
      topLoser,
      avgChange: symbols.reduce((sum, s) => sum + s.changePercent, 0) / symbols.length,
    };
  }, [marketData]);

  // Calculate PAMM statistics
  const pammStats = React.useMemo(() => {
    if (!providersData?.data) return null;

    const providers = providersData.data;
    const profitable = providers.filter(p => p.growth > 0);
    const topPerformer = providers.reduce((max, p) => p.growth > max.growth ? p : max);
    const mostFollowed = providers.reduce((max, p) => p.followers > max.followers ? p : max);

    return {
      totalProviders: providers.length,
      profitableProviders: profitable.length,
      avgGrowth: providers.reduce((sum, p) => sum + p.growth, 0) / providers.length,
      totalFollowers: providers.reduce((sum, p) => sum + p.followers, 0),
      topPerformer,
      mostFollowed,
    };
  }, [providersData]);

  // Top performing categories
  const categoryPerformance = React.useMemo(() => {
    if (!marketData?.data) return [];

    const categories = ['forex', 'crypto', 'commodity', 'index', 'stock'] as const;
    return categories.map(category => {
      const categorySymbols = marketData.data.filter(s => s.category === category);
      const avgChange = categorySymbols.reduce((sum, s) => sum + s.changePercent, 0) / categorySymbols.length;
      const topSymbol = categorySymbols.reduce((max, s) => s.changePercent > max.changePercent ? s : max);

      return {
        category,
        avgChange,
        topSymbol,
        symbolCount: categorySymbols.length,
      };
    }).filter(cat => cat.symbolCount > 0);
  }, [marketData]);

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h1 font-display font-semibold text-white mb-2">
            Market Analytics & Insights
          </h1>
          <p className="text-gray-400">
            Comprehensive overview of market performance and popular trading data
          </p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Market Instruments</h3>
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-mono text-white">
            {marketStats?.totalInstruments || 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Active trading instruments
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Market Direction</h3>
            <Activity className="w-4 h-4 text-success" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-mono text-success">{marketStats?.winners || 0}</span>
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-gray-400">/</span>
            <span className="text-lg font-mono text-danger">{marketStats?.losers || 0}</span>
            <TrendingDown className="w-4 h-4 text-danger" />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Winners / Losers
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">PAMM Providers</h3>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-mono text-white">
            {pammStats?.totalProviders || 0}
          </div>
          <div className="text-xs text-success flex items-center mt-1">
            <Award className="w-3 h-3 mr-1" />
            {pammStats?.profitableProviders || 0} profitable
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Avg Growth</h3>
            <Target className="w-4 h-4 text-warning" />
          </div>
          <div className={`text-2xl font-mono ${
            (pammStats?.avgGrowth || 0) >= 0 ? 'text-success' : 'text-danger'
          }`}>
            {(pammStats?.avgGrowth || 0) >= 0 ? '+' : ''}{(pammStats?.avgGrowth || 0).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Average provider performance
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Top Performing Assets */}
        <div className="bg-neutral rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                Top Performers
              </h3>
              <span className="text-xs text-gray-400">{timeframe} Performance</span>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {marketData?.data
              .filter(s => s.changePercent > 0)
              .sort((a, b) => b.changePercent - a.changePercent)
              .slice(0, 5)
              .map((symbol, index) => (
                <div key={symbol.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{symbol.name}</div>
                      <div className="text-xs text-gray-400">{symbol.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-success font-mono text-sm">+{symbol.changePercent.toFixed(2)}%</div>
                    <div className="text-xs text-gray-400">${symbol.price.toFixed(5)}</div>
                  </div>
                </div>
              )) || []}
          </div>
        </div>

        {/* Top PAMM Providers */}
        <div className="bg-neutral rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-primary" />
                Popular Providers
              </h3>
              <span className="text-xs text-gray-400">Most Followed</span>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {providersData?.data
              .sort((a, b) => b.followers - a.followers)
              .slice(0, 5)
              .map((provider) => (
                <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {provider.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{provider.name}</div>
                      <div className="text-xs text-gray-400">{provider.weeks} weeks • Risk {provider.riskLevel}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-sm ${
                      provider.growth >= 0 ? 'text-success' : 'text-danger'
                    }`}>
                      {provider.growth >= 0 ? '+' : ''}{provider.growth.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {provider.followers} followers
                    </div>
                  </div>
                </div>
              )) || []}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-neutral rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-warning" />
                Category Performance
              </h3>
              <span className="text-xs text-gray-400">By Asset Class</span>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {categoryPerformance.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    category.category === 'forex' ? 'bg-blue-500' :
                    category.category === 'crypto' ? 'bg-orange-500' :
                    category.category === 'commodity' ? 'bg-amber-500' :
                    category.category === 'index' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`}></div>
                  <div>
                    <div className="text-white font-medium text-sm capitalize">{category.category}</div>
                    <div className="text-xs text-gray-400">{category.symbolCount} instruments</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-sm ${
                    category.avgChange >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {category.avgChange >= 0 ? '+' : ''}{category.avgChange.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">avg change</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Active Instruments */}
        <div className="bg-neutral rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Most Active Instruments
            </h3>
            <p className="text-sm text-gray-400">Highest volume and volatility</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase">Symbol</th>
                  <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase">Price</th>
                  <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase">Change</th>
                  <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase">Volume</th>
                </tr>
              </thead>
              <tbody>
                {marketData?.data
                  .sort((a, b) => b.volume - a.volume)
                  .slice(0, 8)
                  .map((symbol) => (
                    <tr key={symbol.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium text-sm">{symbol.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            symbol.category === 'forex' ? 'bg-blue-500/20 text-blue-300' :
                            symbol.category === 'crypto' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {symbol.category}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-white font-mono text-sm">
                        {symbol.price.toFixed(symbol.name.includes('JPY') ? 3 : 5)}
                      </td>
                      <td className="p-3">
                        <div className={`flex items-center space-x-1 text-sm ${
                          symbol.changePercent >= 0 ? 'text-success' : 'text-danger'
                        }`}>
                          {symbol.changePercent >= 0 ? 
                            <TrendingUp className="w-3 h-3" /> : 
                            <TrendingDown className="w-3 h-3" />
                          }
                          <span>{symbol.changePercent >= 0 ? '+' : ''}{symbol.changePercent.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-300 font-mono text-sm">
                        {symbol.volume.toLocaleString()}
                      </td>
                    </tr>
                  )) || []}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top PAMM Performance */}
        <div className="bg-neutral rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              PAMM Leaderboard
            </h3>
            <p className="text-sm text-gray-400">Top performing signal providers</p>
          </div>
          
          <div className="p-4 space-y-3">
            {providersData?.data
              .filter(p => p.growth > 0)
              .sort((a, b) => b.growth - a.growth)
              .slice(0, 6)
              .map((provider, index) => (
                <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-primary text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {provider.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{provider.name}</div>
                      <div className="text-xs text-gray-400">{provider.weeks} weeks • {provider.followers} followers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-success font-mono text-sm">+{provider.growth.toFixed(2)}%</div>
                    <div className="text-xs text-gray-400">Risk {provider.riskLevel}/5</div>
                  </div>
                </div>
              )) || []}
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      {userData && (
        <div className="bg-neutral rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-medium text-white mb-6 flex items-center">
            <PieChart className="w-6 h-6 mr-2 text-primary" />
            Your Portfolio Analytics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Portfolio Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Trading Balance</span>
                  <span className="text-white font-mono">${userData.data.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">PAMM Investments</span>
                  <span className="text-primary font-mono">$1,200.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Unrealized P&L</span>
                  <span className="text-success font-mono">+${userData.data.pl.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Performance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Return</span>
                  <span className="text-success font-mono">+4.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-white font-mono">73.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Max Drawdown</span>
                  <span className="text-warning font-mono">-2.1%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Risk Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Risk Score</span>
                  <span className="text-warning font-mono">3.2/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Margin Usage</span>
                  <span className="text-white font-mono">7.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Active Positions</span>
                  <span className="text-white font-mono">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;