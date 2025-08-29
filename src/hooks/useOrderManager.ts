import { useState, useEffect, useCallback } from 'react';
import orderManager, { AdvancedOrder, OrderQueueStats, AdvancedOrderType } from '../services/orders/OrderManager';
import { OrderStatus } from '../types';

interface UseOrderManagerReturn {
  orders: AdvancedOrder[];
  queueStats: OrderQueueStats;
  loading: boolean;
  error: string | null;
  submitOrder: (orderRequest: Partial<AdvancedOrder>) => Promise<string>;
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>;
  modifyOrder: (orderId: string, modifications: Partial<AdvancedOrder>) => Promise<boolean>;
  getOrder: (orderId: string) => AdvancedOrder | undefined;
  getFilteredOrders: (filter?: any) => AdvancedOrder[];
  cancelBulkOrders: (criteria: any) => Promise<string[]>;
  refreshOrders: () => void;
}

/**
 * Custom hook for advanced order management
 * Provides real-time order tracking and management capabilities
 */
export const useOrderManager = (): UseOrderManagerReturn => {
  const [orders, setOrders] = useState<AdvancedOrder[]>([]);
  const [queueStats, setQueueStats] = useState<OrderQueueStats>(orderManager.getQueueStats());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to order updates
  useEffect(() => {
    const unsubscribe = orderManager.subscribe((updatedOrders) => {
      setOrders(updatedOrders);
      setQueueStats(orderManager.getQueueStats());
    });

    // Initial load
    refreshOrders();

    return unsubscribe;
  }, []);

  // Refresh orders from manager
  const refreshOrders = useCallback(() => {
    const allOrders = orderManager.getOrders();
    setOrders(allOrders);
    setQueueStats(orderManager.getQueueStats());
  }, []);

  // Submit new order
  const submitOrder = useCallback(async (orderRequest: Partial<AdvancedOrder>): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const orderId = await orderManager.submitOrder(orderRequest);
      console.log(`📝 Order submitted successfully: ${orderId}`);
      return orderId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit order';
      setError(errorMessage);
      console.error('❌ Order submission failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);  // Cancel order
  const cancelOrder = useCallback(async (orderId: string, reason?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await orderManager.cancelOrder(orderId, reason);
      console.log(`❌ Order ${orderId} cancelled`);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      setError(errorMessage);
      console.error('❌ Order cancellation failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Modify order
  const modifyOrder = useCallback(async (orderId: string, modifications: Partial<AdvancedOrder>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await orderManager.modifyOrder(orderId, modifications);
      console.log(`✏️  Order ${orderId} modified`);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to modify order';
      setError(errorMessage);
      console.error('❌ Order modification failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get specific order
  const getOrder = useCallback((orderId: string): AdvancedOrder | undefined => {
    return orderManager.getOrder(orderId);
  }, []);

  // Get filtered orders
  const getFilteredOrders = useCallback((filter?: any): AdvancedOrder[] => {
    return orderManager.getOrders(filter);
  }, []);

  // Bulk cancel orders
  const cancelBulkOrders = useCallback(async (criteria: any): Promise<string[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const cancelledIds = await orderManager.cancelOrdersBulk(criteria);
      console.log(`🔄 Bulk cancelled ${cancelledIds.length} orders`);
      return cancelledIds;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel orders';
      setError(errorMessage);
      console.error('❌ Bulk cancellation failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    queueStats,
    loading,
    error,
    submitOrder,
    cancelOrder,
    modifyOrder,
    getOrder,
    getFilteredOrders,
    cancelBulkOrders,
    refreshOrders,
  };
};