import React, { useState } from 'react';
import { useGetOrderHistoryQuery } from '../services/api';
import DataTable from '../components/ui/DataTable';
import { 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  Search,
  RefreshCw,
  FileText,
  BarChart3
} from 'lucide-react';

interface OrderHistoryFilters {
  symbol?: string;
  type?: 'all' | 'buy' | 'sell';
  status?: 'all' | 'open' | 'closed' | 'pending';
  dateFrom?: string;
  dateTo?: string;
}

const History: React.FC = () => {
  const [filters, setFilters] = useState<OrderHistoryFilters>({
    type: 'all',
    status: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: orderHistory, isLoading, refetch } = useGetOrderHistoryQuery({
    page: 1,
    limit: 20,
  });

  const handleExport = (format: 'csv' | 'pdf') => {
    // In a real app, this would generate and download the file
    console.log(`Exporting order history as ${format.toUpperCase()}`);
    alert(`Exporting order history as ${format.toUpperCase()}... (Mock functionality)`);
  };

  const columns = [
    {
      key: 'id' as keyof any,
      label: 'Order ID',
      width: '120px',
      render: (value: string) => (
        <span className="font-mono text-primary text-sm">{value}</span>
      ),
    },
    {
      key: 'symbol' as keyof any,
      label: 'Symbol',
      width: '100px',
      render: (value: string) => (
        <span className="font-medium text-white">{value}</span>
      ),
    },
    {
      key: 'type' as keyof any, 
      label: 'Type',
      width: '80px',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'BUY' 
            ? 'bg-success/20 text-success' 
            : 'bg-danger/20 text-danger'
        }`}>
          {value === 'BUY' ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {value}
        </span>
      ),
    },
    {
      key: 'volume' as keyof any,
      label: 'Volume',
      width: '100px',
      render: (value: number) => (
        <span className="font-mono text-white">{value.toFixed(2)}</span>
      ),
    },
    {
      key: 'openPrice' as keyof any,
      label: 'Open Price',
      width: '120px',
      render: (value: number) => (
        <span className="font-mono text-white">{value.toFixed(5)}</span>
      ),
    },
    {
      key: 'currentPrice' as keyof any,
      label: 'Current Price', 
      width: '120px',
      render: (value: number) => (
        <span className="font-mono text-white">{value.toFixed(5)}</span>
      ),
    },
    {
      key: 'pl' as keyof any,
      label: 'P&L',
      width: '100px',
      render: (value: number) => (
        <span className={`font-mono font-medium ${
          value >= 0 ? 'text-success' : 'text-danger'
        }`}>
          {value >= 0 ? '+' : ''}${value.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'swap' as keyof any,
      label: 'Swap',
      width: '80px',
      render: (value: number) => (
        <span className={`font-mono text-sm ${
          value >= 0 ? 'text-success' : 'text-danger'
        }`}>
          {value >= 0 ? '+' : ''}${value.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'commission' as keyof any,
      label: 'Commission',
      width: '100px',
      render: (value: number) => (
        <span className="font-mono text-gray-400">${value.toFixed(2)}</span>
      ),
    },
    {
      key: 'openTime' as keyof any,
      label: 'Open Time',
      width: '140px',
      render: (value: Date) => (
        <div className="text-sm">
          <div className="text-white">{new Date(value).toLocaleDateString()}</div>
          <div className="text-gray-400 text-xs">{new Date(value).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      key: 'status' as keyof any,
      label: 'Status',
      width: '100px',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'OPEN' ? 'bg-primary/20 text-primary' :
          value === 'CLOSED' ? 'bg-gray-500/20 text-gray-400' :
          'bg-warning/20 text-warning'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  const filteredData = orderHistory?.data.items.filter(order => {
    // Apply search filter
    if (searchTerm && !order.symbol.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply type filter
    if (filters.type !== 'all' && order.type.toLowerCase() !== filters.type) {
      return false;
    }
    
    // Apply status filter
    if (filters.status !== 'all' && order.status.toLowerCase() !== filters.status) {
      return false;
    }
    
    return true;
  }) || [];

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-h1 font-display font-semibold text-white mb-2">
            Order History & Analytics
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Complete trading history with advanced filtering and export capabilities
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => refetch()}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-neutral rounded-xl border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Filter className="w-5 h-5 mr-2 text-primary" />
            Filters & Search
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="buy">Buy Orders</option>
            <option value="sell">Sell Orders</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-neutral rounded-xl border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Trading History</h3>
              <p className="text-sm text-gray-400">
                {orderHistory?.data.totalItems || 0} orders • 
                Showing {filteredData.length} results
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-success" />
                <span className="text-gray-400">Total P&L:</span>
                <span className="text-success font-mono">+$2,456.78</span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading order history...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            loading={isLoading}
            className="bg-neutral"
            searchable={false}
            pagination={true}
            pageSize={20}
          />
        )}
      </div>
    </div>
  );
};

export default History;