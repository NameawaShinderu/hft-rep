import React, { useState } from 'react';
import { useGetUserDataQuery } from '../services/api';
import { 
  PieChart, 
  Activity,
  DollarSign,
  Percent,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  currentPrice: number;
  pl: number;
  swap: number;
  commission: number;
  openTime: Date;
}

// Mock active positions
const mockPositions: Position[] = [
  {
    id: 'POS001',
    symbol: 'EURUSD',
    type: 'buy',
    volume: 2.5,
    openPrice: 1.0823,
    currentPrice: 1.0845,
    pl: 550.00,
    swap: -2.50,
    commission: 7.50,
    openTime: new Date('2025-08-28T14:30:00'),
  },
  {
    id: 'POS002', 
    symbol: 'BTCUSD',
    type: 'sell',
    volume: 0.1,
    openPrice: 44200.00,
    currentPrice: 43567.89,
    pl: 632.11,
    swap: 0,
    commission: 15.00,
    openTime: new Date('2025-08-27T09:15:00'),
  },
  {
    id: 'POS003',
    symbol: 'XAUUSD',
    type: 'buy',
    volume: 1.0,
    openPrice: 1910.50,
    currentPrice: 1925.45,
    pl: 1495.00,
    swap: -5.20,
    commission: 12.00,
    openTime: new Date('2025-08-26T16:45:00'),
  },
];

const Portfolio: React.FC = () => {
  const { data: userData, isLoading } = useGetUserDataQuery('user123');
  const [activeTab, setActiveTab] = useState<'positions' | 'history' | 'analytics'>('positions');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  const totalPL = mockPositions.reduce((sum, pos) => sum + pos.pl, 0);

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-h1 font-display font-semibold text-white mb-2">
          Portfolio Management
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Monitor your positions, performance, and portfolio analytics
        </p>
      </div>

      {/* Portfolio Overview Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-neutral rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Balance</h3>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-mono text-white">
            ${userData?.data.balance.toLocaleString() || '50,000.00'}
          </div>
          <div className="text-xs text-success flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            +2.4% from last month
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Current P&L</h3>
            <Activity className="w-4 h-4 text-success" />
          </div>
          <div className={`text-2xl font-mono ${totalPL >= 0 ? 'text-success' : 'text-danger'}`}>
            {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {mockPositions.length} active position{mockPositions.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Used Margin</h3>
            <PieChart className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-mono text-white">
            ${userData?.data.usedMargin.toLocaleString() || '3,575.20'}
          </div>
          <div className="text-xs text-warning flex items-center mt-1">
            <Percent className="w-3 h-3 mr-1" />
            7.2% of equity
          </div>
        </div>

        <div className="bg-neutral rounded-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Free Margin</h3>
            <Target className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-mono text-white">
            ${userData?.data.freeMargin.toLocaleString() || '48,765.30'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Available for trading
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-fit">
        {(['positions', 'history', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'positions' && (
        <div className="bg-neutral rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Active Positions</h3>
            <p className="text-sm text-gray-400">Manage your current trading positions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Volume</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Open Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">P&L</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Open Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockPositions.map((position) => (
                  <tr key={position.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-white font-medium">{position.symbol}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        position.type === 'buy' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-danger/20 text-danger'
                      }`}>
                        {position.type === 'buy' ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {position.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-white font-mono">
                      {position.volume}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-white font-mono">
                      {position.openPrice.toFixed(5)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-white font-mono">
                      {position.currentPrice.toFixed(5)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`font-mono font-medium ${
                        position.pl >= 0 ? 'text-success' : 'text-danger'
                      }`}>
                        {position.pl >= 0 ? '+' : ''}${position.pl.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-400 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {position.openTime.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button className="text-danger hover:text-danger/80 text-sm font-medium transition-colors">
                        Close
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {mockPositions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active positions</p>
              <p className="text-sm">Your open trades will appear here</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-neutral rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Performance Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Win Rate</h4>
              <div className="text-2xl font-mono text-success">68.5%</div>
              <div className="text-xs text-gray-400 mt-1">142 wins / 207 trades</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Profit Factor</h4>
              <div className="text-2xl font-mono text-white">1.85</div>
              <div className="text-xs text-gray-400 mt-1">Above 1.0 is profitable</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Max Drawdown</h4>
              <div className="text-2xl font-mono text-warning">-8.3%</div>
              <div className="text-xs text-gray-400 mt-1">Largest equity drop</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;