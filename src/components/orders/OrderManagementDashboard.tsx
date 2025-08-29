import React, { useState } from 'react';
import { useOrderManager } from '../../hooks/useOrderManager';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Zap,
  BarChart3
} from 'lucide-react';

interface OrderDashboardProps {
  className?: string;
}

const OrderManagementDashboard: React.FC<OrderDashboardProps> = ({ className = '' }) => {
  const { 
    orders, 
    queueStats, 
    loading, 
    error, 
    cancelBulkOrders, 
    refreshOrders 
  } = useOrderManager();
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }).slice(0, 100); // Limit display for performance

  const handleBulkCancel = async () => {
    if (confirm('Cancel all pending orders? This action cannot be undone.')) {
      try {
        await cancelBulkOrders({ status: 'pending' });
      } catch (err) {
        console.error('Bulk cancellation failed:', err);
      }
    }
  };

  const exportOrders = () => {
    const csv = [
      'ID,Symbol,Type,Side,Quantity,Price,Status,Created,Executed,P&L',
      ...filteredOrders.map(order => [
        order.id,
        order.symbol,
        order.type,
        order.side,
        order.quantity,
        order.avgFillPrice || order.price || '',
        order.status,
        order.createdAt.toISOString(),
        order.executedAt?.toISOString() || '',
        ((order.avgFillPrice || 0) * order.filledQuantity - order.fees).toFixed(2)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };  return (
    <div className={`space-y-6 ${className}`}>
      {/* Queue Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">Total Orders</h4>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono text-white">{queueStats.totalOrders.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">All time</div>
        </div>

        <div className="bg-neutral rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">Queue Size</h4>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-mono text-white">{queueStats.pendingOrders}</div>
          <div className="text-xs text-gray-400 mt-1">Pending execution</div>
        </div>

        <div className="bg-neutral rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">Processing Rate</h4>
            <Zap className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-mono text-white">{queueStats.queueProcessingRate.toFixed(1)}</div>
          <div className="text-xs text-gray-400 mt-1">Orders/sec</div>
        </div>

        <div className="bg-neutral rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">Success Rate</h4>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-mono text-white">
            {((1 - queueStats.errorRate) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">Execution success</div>
        </div>
      </div>

      {/* Order Management Controls */}
      <div className="bg-neutral rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Order Management</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshOrders}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportOrders}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleBulkCancel}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel All</span>
            </button>
          </div>
        </div>        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders by symbol or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="filled">Filled</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
              <option value="partial">Partial Fill</option>
            </select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left p-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                <th className="text-left p-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Symbol</th>
                <th className="text-left p-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                <th className="text-left p-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Side</th>
                <th className="text-right p-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                <th className="text-right p-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th className="text-left p-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="text-left p-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                <th className="text-center p-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-400">
                    No orders found matching current filters
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800/30 transition-colors">
                    <td className="p-3">
                      <span className="text-white font-mono text-sm">{order.id.slice(-8)}</span>
                      {order.priority === 'urgent' && <Zap className="w-3 h-3 text-yellow-400 ml-1 inline" />}
                    </td>
                    <td className="p-3 text-white font-medium">{order.symbol}</td>
                    <td className="p-3">
                      <span className="text-gray-300 text-sm capitalize">{order.type}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.side === 'buy' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-danger/20 text-danger'
                      }`}>
                        {order.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right text-white font-mono">
                      {order.filledQuantity > 0 ? (
                        <div>
                          <div>{order.filledQuantity.toFixed(2)}</div>
                          <div className="text-xs text-gray-400">of {order.quantity.toFixed(2)}</div>
                        </div>
                      ) : (
                        order.quantity.toFixed(2)
                      )}
                    </td>
                    <td className="p-3 text-right text-white font-mono">
                      {order.avgFillPrice?.toFixed(5) || order.price?.toFixed(5) || 'Market'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        {order.status === 'filled' && <CheckCircle className="w-4 h-4 text-success" />}
                        {order.status === 'pending' && <Clock className="w-4 h-4 text-warning" />}
                        {order.status === 'cancelled' && <XCircle className="w-4 h-4 text-gray-400" />}
                        {order.status === 'rejected' && <AlertTriangle className="w-4 h-4 text-danger" />}
                        <span className={`text-xs font-medium capitalize ${
                          order.status === 'filled' ? 'text-success' :
                          order.status === 'pending' ? 'text-warning' :
                          order.status === 'cancelled' ? 'text-gray-400' :
                          'text-danger'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-300 text-sm">
                      {order.createdAt.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => {/* Will implement order actions */}}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="flex items-center justify-between pt-4 text-sm text-gray-400">
          <span>
            Showing {Math.min(filteredOrders.length, 100)} of {orders.length} orders
            {orders.length > 100 && ' (limited to 100 for performance)'}
          </span>
          <div className="flex items-center space-x-4">
            <span>
              Avg execution: {queueStats.averageExecutionTime.toFixed(0)}ms
            </span>
            <span className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3" />
              <span>{queueStats.queueProcessingRate.toFixed(1)} ops/s</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementDashboard;