import React from 'react';
import MarketWatch from '../components/trading/MarketWatch';
import MAMSystem from '../components/trading/MAMSystem';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h1 font-display font-semibold text-white mb-2">
          Trading Dashboard
        </h1>
        <p className="text-gray-400">
          Monitor markets and manage your trading portfolio
        </p>
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