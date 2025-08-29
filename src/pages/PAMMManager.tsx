import React, { useState, useMemo } from 'react';
import { useGetSignalProvidersQuery } from '../services/api';
import { useAppDispatch } from '../store/hooks';
import { toggleFollowProvider } from '../store/slices/mamSlice';
import { 
  Activity,
  Search,
  Filter,
  Star
} from 'lucide-react';

interface InvestmentModalProps {
  provider: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, allocation: number) => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ provider, isOpen, onClose, onConfirm }) => {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [allocationPercent, setAllocationPercent] = useState(10);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral rounded-xl border border-gray-700 p-6 w-full max-w-md">
        <h3 className="text-xl font-medium text-white mb-4">Subscribe to {provider.name}</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Investment Amount ($)</label>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              min="100"
              step="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Allocation (%)</label>
            <input
              type="number"
              value={allocationPercent}
              onChange={(e) => setAllocationPercent(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
              max="50"
              step="1"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(investmentAmount, allocationPercent)}
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary/90 rounded-lg text-white transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const PAMMManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useGetSignalProvidersQuery();
  const [activeTab, setActiveTab] = useState<'pamm_manager' | 'my_subscription'>('pamm_manager');
  const [searchTerm, setSearchTerm] = useState('');
  const [investmentModal, setInvestmentModal] = useState<{ open: boolean; provider?: any }>({ open: false });

  // Enhanced mock data for PAMM providers (matching the screenshot data)
  const enhancedProviders = useMemo(() => {
    const mockData = [
      {
        id: 'DEMO001',
        name: 'demo',
        rank: 1,
        growth: -9677.25,
        weeks: 0,
        followers: 5,
        drawdown: 0,
        fund: 1610.00,
        riskLevel: 1,
        isFollowed: false,
        sparklineData: Array.from({ length: 20 }, (_, i) => 100 - (i * 15) + Math.sin(i) * 5),
      },
      {
        id: 'LISA001',
        name: 'Lisa',
        rank: 1,
        growth: 1172.60,
        weeks: 24,
        followers: 2,
        drawdown: 0,
        fund: 600.00,
        riskLevel: 1,
        isFollowed: false,
        sparklineData: Array.from({ length: 20 }, (_, i) => 50 + (i * 8) + Math.sin(i * 0.8) * 10),
      },
      {
        id: 'HARSHA001',
        name: 'Harsha',
        rank: 1,
        growth: 9194.28,
        weeks: 35,
        followers: 5,
        drawdown: 0,
        fund: 1400.00,
        riskLevel: 1,
        isFollowed: true,
        investment: 100,
        sharedPnl: 7.58,
        netAmount: 107.58,
        sparklineData: Array.from({ length: 20 }, (_, i) => 30 + (i * 12) + Math.sin(i * 0.6) * 8),
      },
      {
        id: 'TEST001',
        name: 'Test',
        rank: 1,
        growth: -183.81,
        weeks: 41,
        followers: 2,
        drawdown: 0,
        fund: 160.00,
        riskLevel: 1,
        isFollowed: false,
        sparklineData: Array.from({ length: 20 }, (_, i) => 80 - (i * 3) + Math.sin(i * 0.7) * 6),
      },
      {
        id: 'AZAR001',
        name: 'azar dmo',
        rank: 1,
        growth: -789.77,
        weeks: 0,
        followers: 0,
        drawdown: 0,
        fund: 0.00,
        riskLevel: 1,
        isFollowed: false,
        sparklineData: Array.from({ length: 20 }, (_, i) => 90 - (i * 8) + Math.sin(i * 0.9) * 4),
      },
      {
        id: 'SAP001',
        name: 'sap',
        rank: 1,
        growth: -0.12,
        weeks: 0,
        followers: 0,
        drawdown: 0,
        fund: 0.00,
        riskLevel: 1,
        isFollowed: false,
        sparklineData: Array.from({ length: 20 }, (_, i) => 50 + Math.sin(i * 0.5) * 2),
      },
    ];

    return mockData;
  }, []);

  // Filter providers based on active tab
  const filteredProviders = useMemo(() => {
    let filtered = enhancedProviders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab
    if (activeTab === 'my_subscription') {
      filtered = filtered.filter(provider => provider.isFollowed);
    }

    return filtered;
  }, [enhancedProviders, searchTerm, activeTab]);

  const SparklineChart = ({ data, growth }: { data: number[]; growth: number }) => {
    const isPositive = growth >= 0;
    const normalizedData = data.map(value => Math.max(0, Math.min(100, value)));
    
    const pathData = normalizedData.map((point, index) => {
      const x = (index / (normalizedData.length - 1)) * 60;
      const y = 24 - (point / 100) * 24;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    return (
      <div className="flex items-center space-x-2">
        <svg width="60" height="24" viewBox="0 0 60 24" className="overflow-visible">
          <path
            d={pathData}
            fill="none"
            stroke={isPositive ? '#00D4AA' : '#FF6B6B'}
            strokeWidth="2"
            className="drop-shadow-sm"
          />
        </svg>
        <span className={`font-mono font-semibold text-sm ${
          isPositive ? 'text-success' : 'text-danger'
        }`}>
          {growth >= 0 ? '+' : ''}{Math.abs(growth).toFixed(2)}
        </span>
      </div>
    );
  };

  const handleFollowToggle = (provider: any) => {
    if (provider.isFollowed) {
      // Unfollow logic
      dispatch(toggleFollowProvider(provider.id));
    } else {
      // Open investment modal for following
      setInvestmentModal({ open: true, provider });
    }
  };

  const handleConfirmInvestment = (amount: number, allocation: number) => {
    if (investmentModal.provider) {
      // In a real app, this would call the investment API
      console.log(`Investing $${amount} (${allocation}%) in ${investmentModal.provider.name}`);
      dispatch(toggleFollowProvider(investmentModal.provider.id));
      setInvestmentModal({ open: false });
      alert(`Successfully subscribed to ${investmentModal.provider.name} with $${amount} investment!`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading PAMM providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-h1 font-display font-semibold text-white mb-2">
          PAMM Manager System
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Professional Multi Account Manager with signal provider subscriptions
        </p>
      </div>

      {/* Tab Navigation - Mobile Responsive */}
      <div className="flex space-x-0 bg-neutral border border-gray-700 rounded-xl overflow-hidden w-full sm:w-fit">
        <button
          onClick={() => setActiveTab('pamm_manager')}
          className={`flex-1 sm:flex-initial px-4 sm:px-6 py-3 font-medium transition-colors text-center ${
            activeTab === 'pamm_manager'
              ? 'bg-primary text-white'
              : 'bg-neutral text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <span className="hidden sm:inline">PAMM MANAGER</span>
          <span className="sm:hidden">PAMM</span>
        </button>
        <button
          onClick={() => setActiveTab('my_subscription')}
          className={`flex-1 sm:flex-initial px-4 sm:px-6 py-3 font-medium transition-colors text-center ${
            activeTab === 'my_subscription'
              ? 'bg-primary text-white'
              : 'bg-neutral text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <span className="hidden sm:inline">MY SUBSCRIPTION</span>
          <span className="sm:hidden">SUBSCRIPTIONS</span>
        </button>
      </div>

      {/* Search and Filters - Mobile Responsive */}
      {activeTab === 'pamm_manager' && (
        <div className="bg-neutral rounded-xl border border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
            <h3 className="text-lg font-medium text-white">Find Signal Providers</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAMM Providers Table - Dark Theme */}
      <div className="bg-neutral rounded-xl border border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <h3 className="text-lg font-medium text-white">
            {activeTab === 'pamm_manager' ? 'Available Signal Providers' : 'My Active Subscriptions'}
          </h3>
        </div>

        {/* Table Content - Mobile Responsive */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">Name</th>
                {activeTab === 'pamm_manager' ? (
                  <>
                    <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[60px]">Rank</th>
                    <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[100px]">Growth</th>
                    <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[70px]">Weeks</th>
                    <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[80px]">Followers</th>
                    <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[90px]">Drawdown</th>
                    <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[80px]">Fund</th>
                    <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[80px]">Risk Level</th>
                    <th className="text-center p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[100px]">Action</th>
                  </>
                ) : (
                  <>
                    <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[70px]">Weeks</th>
                    <th className="text-left p-3 sm:p-4 text-sm font-medium text-gray-300 uppercase tracking-wider min-w-[80px]">Followers</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Risk Level</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Fund</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Investment</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Shared PNL</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Net Amount</th>
                    <th className="text-center p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-neutral">
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    {activeTab === 'my_subscription' ? 'No active subscriptions' : 'No providers found'}
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider, index) => (
                  <tr 
                    key={provider.id} 
                    className={`${index % 2 === 0 ? 'bg-neutral' : 'bg-gray-800/30'} hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0`}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {provider.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{provider.name}</span>
                        {provider.isFollowed && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </td>
                    
                    {activeTab === 'pamm_manager' ? (
                      <>
                        <td className="p-4 text-gray-800">{provider.rank}</td>
                        <td className="p-4">
                          <SparklineChart data={provider.sparklineData} growth={provider.growth} />
                        </td>
                        <td className="p-4 text-gray-300">{provider.weeks}</td>
                        <td className="p-4 text-gray-300">{provider.followers}</td>
                        <td className="p-4 text-gray-300">{provider.drawdown}</td>
                        <td className="p-4 text-gray-300 font-mono">{provider.fund.toFixed(2)}</td>
                        <td className="p-4 text-gray-300">{provider.riskLevel}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleFollowToggle(provider)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                              provider.isFollowed
                                ? 'bg-danger/20 text-danger border-danger/30 hover:bg-danger/30'
                                : 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
                            }`}
                          >
                            {provider.isFollowed ? 'UnFollow 👤' : 'Follow 👤'}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4 text-gray-300">{provider.weeks}</td>
                        <td className="p-4 text-gray-300">{provider.followers}</td>
                        <td className="p-4 text-gray-300">{provider.riskLevel}</td>
                        <td className="p-4 text-gray-300 font-mono">{provider.fund.toFixed(2)}</td>
                        <td className="p-4 text-gray-300 font-mono">{provider.investment || 0}</td>
                        <td className="p-4">
                          <span className={`font-mono font-medium ${
                            (provider.sharedPnl || 0) >= 0 ? 'text-success' : 'text-danger'
                          }`}>
                            {(provider.sharedPnl || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-mono font-medium ${
                            (provider.netAmount || 0) >= (provider.investment || 0) ? 'text-success' : 'text-danger'
                          }`}>
                            {(provider.netAmount || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-xs hover:bg-primary/30 transition-colors">
                              Edit
                            </button>
                            <button 
                              onClick={() => handleFollowToggle(provider)}
                              className="px-3 py-1 bg-danger/20 text-danger border border-danger/30 rounded text-xs hover:bg-danger/30 transition-colors"
                            >
                              Unsubscribe
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Stats */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {activeTab === 'pamm_manager' 
                ? `${filteredProviders.length} providers available`
                : `${filteredProviders.length} active subscriptions`
              }
            </span>
            {activeTab === 'my_subscription' && filteredProviders.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Total Invested: <span className="font-mono font-medium text-gray-800">
                    ${filteredProviders.reduce((sum, p) => sum + (p.investment || 0), 0).toFixed(2)}
                  </span>
                </span>
                <span className="text-gray-600">
                  Total P&L: <span className={`font-mono font-medium ${
                    filteredProviders.reduce((sum, p) => sum + (p.sharedPnl || 0), 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${filteredProviders.reduce((sum, p) => sum + (p.sharedPnl || 0), 0).toFixed(2)}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      <InvestmentModal
        provider={investmentModal.provider}
        isOpen={investmentModal.open}
        onClose={() => setInvestmentModal({ open: false })}
        onConfirm={handleConfirmInvestment}
      />
    </div>
  );
};

export default PAMMManager;