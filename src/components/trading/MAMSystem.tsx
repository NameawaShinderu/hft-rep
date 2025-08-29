import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { useGetSignalProvidersQuery } from '../../services/api';
import { toggleFollowProvider } from '../../store/slices/mamSlice';
import { Users, Target } from 'lucide-react';

const MAMSystem: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: providersData, isLoading } = useGetSignalProvidersQuery();

  // Use data from API service
  const providers = providersData?.data || [];

  const handleToggleFollow = (providerId: string) => {
    dispatch(toggleFollowProvider(providerId));
  };

  const SparklineChart = ({ growth }: { growth: number }) => {
    const isPositive = growth >= 0;
    const points = Array.from({ length: 20 }, (_, i) => {
      const baseValue = 50;
      const trend = isPositive ? (i * 2) : -(i * 1.5);
      const noise = Math.sin(i * 0.5) * 5;
      return Math.max(10, Math.min(90, baseValue + trend + noise));
    });

    const pathData = points.map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - point;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    return (
      <svg width="60" height="24" viewBox="0 0 100 100" className="w-15 h-6">
        <path
          d={pathData}
          fill="none"
          stroke={isPositive ? '#00D4AA' : '#FF6B6B'}
          strokeWidth="3"
          className="drop-shadow-sm"
        />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-neutral rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading signal providers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 font-display font-semibold text-white mb-2">
            TRADING MANAGER
          </h2>
          <p className="text-gray-400">
            Multi Account Manager - Copy Trading System
          </p>
        </div>
      </div>

      {/* MAM Table */}
      <div className="bg-neutral rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-h3 font-semibold text-white">MY SUBSCRIPTION</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800">
                <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Growth</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Weeks</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Followers</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Drawdown</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Fund</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Risk Level</th>
                <th className="text-center p-4 text-sm font-medium text-gray-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {provider.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{provider.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white">{provider.rank}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <SparklineChart growth={provider.growth} />
                      <span className={`font-mono font-semibold ${
                        provider.growth >= 0 ? 'text-success' : 'text-danger'
                      }`}>
                        {provider.growth >= 0 ? '+' : ''}{provider.growth.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-white">{provider.weeks}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1 text-white">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{provider.followers}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white">{provider.drawdown}%</td>
                  <td className="p-4 text-white font-mono">{provider.fund.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{provider.riskLevel}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleFollow(provider.id)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        provider.isFollowed
                          ? 'bg-danger text-white hover:bg-red-600'
                          : 'bg-primary text-white hover:bg-blue-600'
                      }`}
                    >
                      {provider.isFollowed ? 'UnFollow' : 'Follow'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MAMSystem;