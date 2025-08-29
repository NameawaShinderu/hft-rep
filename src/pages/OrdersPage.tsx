import React, { useState } from 'react';
import { useOrderManager } from '../hooks/useOrderManager';
import OrderManagementDashboard from '../components/orders/OrderManagementDashboard';
import { 
  Plus, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  Target,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';

const OrdersPage: React.FC = () => {
  const { orders, queueStats, submitOrder } = useOrderManager();
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [quickOrderForm, setQuickOrderForm] = useState({
    symbol: 'EURUSD',
    side: 'buy' as 'buy' | 'sell',
    quantity: 1,
    type: 'market' as any,
    price: ''
  });

  // Quick order submission for testing the order manager
  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const orderId = await submitOrder({
        symbol: quickOrderForm.symbol,
        side: quickOrderForm.side,
        quantity: quickOrderForm.quantity,
        type: quickOrderForm.type,
        price: quickOrderForm.type !== 'market' ? parseFloat(quickOrderForm.price) : undefined,
        priority: 'normal',
        timeInForce: 'GTC',
        metadata: {
          source: 'manual',
          notes: 'Test order from Orders page'
        }
      });
      
      console.log(`✅ Quick order submitted: ${orderId}`);
      setShowQuickOrder(false);
      
      // Reset form
      setQuickOrderForm({
        symbol: 'EURUSD',
        side: 'buy',
        quantity: 1,
        type: 'market',
        price: ''
      });
      
    } catch (error) {
      console.error('❌ Quick order failed:', error);
    }
  };

  // Calculate summary statistics
  const recentOrders = orders.slice(0, 10);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const filledToday = orders.filter(o => {
    const today = new Date();
    return o.status === 'filled' && 
           o.executedAt &&
           o.executedAt.toDateString() === today.toDateString();
  });

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h1 font-display font-semibold text-white mb-2">
            Order Management Center
          </h1>
          <p className="text-gray-400">
            Advanced order processing with 3,500+ order capacity
          </p>
        </div>
        
        <button
          onClick={() => setShowQuickOrder(!showQuickOrder)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Order</span>
        </button>
      </div>      {/* Quick Order Form */}
      {showQuickOrder && (
        <div className="bg-neutral rounded-lg border border-gray-700 p-4 mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Quick Order Submission</h3>
          <form onSubmit={handleQuickOrder} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Symbol"
              value={quickOrderForm.symbol}
              onChange={(e) => setQuickOrderForm(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <select
              value={quickOrderForm.side}
              onChange={(e) => setQuickOrderForm(prev => ({ ...prev, side: e.target.value as 'buy' | 'sell' }))}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="buy">BUY</option>
              <option value="sell">SELL</option>
            </select>
            
            <input
              type="number"
              placeholder="Quantity"
              step="0.01"
              value={quickOrderForm.quantity}
              onChange={(e) => setQuickOrderForm(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 1 }))}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <select
              value={quickOrderForm.type}
              onChange={(e) => setQuickOrderForm(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
              <option value="stop">Stop</option>
            </select>
            
            {quickOrderForm.type !== 'market' && (
              <input
                type="number"
                placeholder="Price"
                step="0.00001"
                value={quickOrderForm.price}
                onChange={(e) => setQuickOrderForm(prev => ({ ...prev, price: e.target.value }))}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
            
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                quickOrderForm.side === 'buy'
                  ? 'bg-success hover:bg-success/90 text-white'
                  : 'bg-danger hover:bg-danger/90 text-white'
              }`}
            >
              Submit Order
            </button>
          </form>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">Recent Activity</h4>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono text-white">{recentOrders.length}</div>
          <div className="text-xs text-gray-400">Last 10 orders</div>
        </div>

        <div className="bg-neutral rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">Pending Queue</h4>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-mono text-white">{pendingOrders.length}</div>
          <div className="text-xs text-gray-400">Awaiting execution</div>
        </div>

        <div className="bg-neutral rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">Today's Fills</h4>
            <CheckCircle className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-mono text-white">{filledToday.length}</div>
          <div className="text-xs text-gray-400">Completed orders</div>
        </div>

        <div className="bg-neutral rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">Processing Rate</h4>
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-mono text-white">{queueStats.queueProcessingRate.toFixed(1)}</div>
          <div className="text-xs text-gray-400">Orders/sec</div>
        </div>
      </div>

      {/* System Status Alert */}
      {queueStats.pendingOrders > 100 && (
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <h4 className="font-medium text-yellow-400">High Queue Volume</h4>
              <p className="text-sm text-gray-300">
                {queueStats.pendingOrders} orders in queue. Processing at {queueStats.queueProcessingRate.toFixed(1)} orders/second.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Management Dashboard */}
      <OrderManagementDashboard />
    </div>
  );
};

export default OrdersPage;