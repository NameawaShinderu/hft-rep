import { store } from '../../store';
import { Order, OrderType, OrderStatus, Symbol } from '../../types';

// Enhanced order types for HFT platform
export type AdvancedOrderType = 
  | 'market' 
  | 'limit' 
  | 'stop' 
  | 'stop-limit'
  | 'trailing-stop'
  | 'oco' // One Cancels Other
  | 'bracket'
  | 'iceberg'
  | 'fill-or-kill'
  | 'immediate-or-cancel';

export interface AdvancedOrder {
  id: string;
  clientOrderId?: string;
  symbol: string;
  type: AdvancedOrderType;
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  status: OrderStatus;
  filledQuantity: number;
  avgFillPrice?: number;
  remainingQuantity: number;
  fees: number;
  createdAt: Date;
  updatedAt: Date;
  executedAt?: Date;
  parentOrderId?: string; // For bracket/OCO orders
  childOrders?: string[]; // For parent orders
  modificationCount: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: {
    strategy?: string;
    source?: 'manual' | 'algorithm' | 'copy-trading';
    riskLevel?: number;
    maxSlippage?: number;
    notes?: string;
  };
}

export interface OrderQueueStats {
  totalOrders: number;
  pendingOrders: number;
  executedOrders: number;
  cancelledOrders: number;
  averageExecutionTime: number;
  queueProcessingRate: number; // orders per second
  errorRate: number;
  lastProcessedTime: Date;
}

class AdvancedOrderManager {
  private orders = new Map<string, AdvancedOrder>();
  private orderQueue: AdvancedOrder[] = [];
  private processingQueue = false;
  private queueStats: OrderQueueStats = {
    totalOrders: 0,
    pendingOrders: 0,
    executedOrders: 0,
    cancelledOrders: 0,
    averageExecutionTime: 0,
    queueProcessingRate: 0,
    errorRate: 0,
    lastProcessedTime: new Date(),
  };
  private subscribers = new Set<(orders: AdvancedOrder[]) => void>();
  private executionCallbacks = new Map<string, (order: AdvancedOrder) => void>();
  
  constructor() {
    this.startQueueProcessor();
    console.log('🔧 Advanced Order Manager initialized');
  }  /**
   * Add new order to the processing queue
   */
  public async submitOrder(orderRequest: Partial<AdvancedOrder>): Promise<string> {
    const order: AdvancedOrder = {
      id: this.generateOrderId(),
      clientOrderId: orderRequest.clientOrderId,
      symbol: orderRequest.symbol!,
      type: orderRequest.type || 'market',
      side: orderRequest.side!,
      quantity: orderRequest.quantity!,
      price: orderRequest.price,
      stopPrice: orderRequest.stopPrice,
      timeInForce: orderRequest.timeInForce || 'GTC',
      status: 'pending',
      filledQuantity: 0,
      remainingQuantity: orderRequest.quantity!,
      fees: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      modificationCount: 0,
      priority: orderRequest.priority || 'normal',
      metadata: orderRequest.metadata,
    };

    this.orders.set(order.id, order);
    this.orderQueue.push(order);
    this.queueStats.totalOrders++;
    this.queueStats.pendingOrders++;
    
    console.log(`📝 Order ${order.id} submitted to queue`);
    this.notifySubscribers();
    
    return order.id;
  }

  /**
   * Cancel an existing order
   */
  public async cancelOrder(orderId: string, reason?: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    if (order.status === 'filled' || order.status === 'cancelled') {
      throw new Error(`Cannot cancel order ${orderId}: already ${order.status}`);
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    order.metadata = { ...order.metadata, cancellationReason: reason };
    
    this.queueStats.cancelledOrders++;
    this.queueStats.pendingOrders = Math.max(0, this.queueStats.pendingOrders - 1);
    
    console.log(`❌ Order ${orderId} cancelled: ${reason || 'User request'}`);
    this.notifySubscribers();
    
    return true;
  }  /**
   * Modify an existing order (price, quantity, etc.)
   */
  public async modifyOrder(orderId: string, modifications: Partial<AdvancedOrder>): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    if (order.status !== 'pending') {
      throw new Error(`Cannot modify order ${orderId}: status is ${order.status}`);
    }

    // Apply modifications
    Object.assign(order, modifications, {
      updatedAt: new Date(),
      modificationCount: order.modificationCount + 1,
    });
    
    console.log(`✏️  Order ${orderId} modified (modification #${order.modificationCount})`);
    this.notifySubscribers();
    
    return true;
  }

  /**
   * Get order by ID
   */
  public getOrder(orderId: string): AdvancedOrder | undefined {
    return this.orders.get(orderId);
  }

  /**
   * Get all orders with optional filtering
   */
  public getOrders(filter?: {
    symbol?: string;
    status?: OrderStatus;
    side?: 'buy' | 'sell';
    type?: AdvancedOrderType;
    dateFrom?: Date;
    dateTo?: Date;
  }): AdvancedOrder[] {
    let orders = Array.from(this.orders.values());
    
    if (filter) {
      if (filter.symbol) {
        orders = orders.filter(o => o.symbol === filter.symbol);
      }
      if (filter.status) {
        orders = orders.filter(o => o.status === filter.status);
      }
      if (filter.side) {
        orders = orders.filter(o => o.side === filter.side);
      }
      if (filter.type) {
        orders = orders.filter(o => o.type === filter.type);
      }
      if (filter.dateFrom) {
        orders = orders.filter(o => o.createdAt >= filter.dateFrom!);
      }
      if (filter.dateTo) {
        orders = orders.filter(o => o.createdAt <= filter.dateTo!);
      }
    }
    
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }  /**
   * Get queue statistics for monitoring
   */
  public getQueueStats(): OrderQueueStats {
    return { ...this.queueStats };
  }

  /**
   * Subscribe to order updates
   */
  public subscribe(callback: (orders: AdvancedOrder[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Set execution callback for specific order
   */
  public onOrderExecution(orderId: string, callback: (order: AdvancedOrder) => void): void {
    this.executionCallbacks.set(orderId, callback);
  }

  /**
   * Notify all subscribers of order updates
   */
  private notifySubscribers(): void {
    const orders = Array.from(this.orders.values());
    this.subscribers.forEach(callback => {
      try {
        callback(orders);
      } catch (error) {
        console.error('Error in order subscriber:', error);
      }
    });
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `ORD_${timestamp}_${randomStr}`.toUpperCase();
  }  /**
   * Start the order queue processor
   */
  private startQueueProcessor(): void {
    setInterval(() => {
      if (!this.processingQueue && this.orderQueue.length > 0) {
        this.processOrderQueue();
      }
    }, 100); // Process every 100ms for high frequency
  }

  /**
   * Process orders in the queue
   */
  private async processOrderQueue(): Promise<void> {
    if (this.processingQueue || this.orderQueue.length === 0) return;
    
    this.processingQueue = true;
    const startTime = performance.now();
    
    try {
      // Process up to 50 orders per batch for performance
      const batchSize = Math.min(50, this.orderQueue.length);
      const batch = this.orderQueue.splice(0, batchSize);
      
      for (const order of batch) {
        await this.executeOrder(order);
      }
      
      // Update processing statistics
      const executionTime = performance.now() - startTime;
      this.updateQueueStats(batchSize, executionTime);
      
    } catch (error) {
      console.error('❌ Error processing order queue:', error);
      this.queueStats.errorRate = (this.queueStats.errorRate * 0.9) + 0.1; // Exponential average
    } finally {
      this.processingQueue = false;
    }
  }

  /**
   * Execute individual order
   */
  private async executeOrder(order: AdvancedOrder): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Simulate market execution with realistic delays
      const executionDelay = this.calculateExecutionDelay(order);
      await new Promise(resolve => setTimeout(resolve, executionDelay));
      
      // Get current market price
      const currentPrice = this.getCurrentMarketPrice(order.symbol);
      if (!currentPrice) {
        throw new Error(`No market data for symbol ${order.symbol}`);
      }

      // Execute based on order type
      const executionResult = await this.simulateOrderExecution(order, currentPrice);
      
      // Update order status
      order.status = executionResult.status;
      order.filledQuantity = executionResult.filledQuantity;
      order.avgFillPrice = executionResult.avgFillPrice;
      order.remainingQuantity = order.quantity - executionResult.filledQuantity;
      order.fees = executionResult.fees;
      order.executedAt = executionResult.executedAt;
      order.updatedAt = new Date();

      // Update statistics
      if (order.status === 'filled') {
        this.queueStats.executedOrders++;
        this.queueStats.pendingOrders = Math.max(0, this.queueStats.pendingOrders - 1);
      }

      // Execute callback if registered
      const callback = this.executionCallbacks.get(order.id);
      if (callback) {
        callback(order);
        this.executionCallbacks.delete(order.id);
      }

      console.log(`✅ Order ${order.id} executed: ${order.filledQuantity}/${order.quantity} @ ${order.avgFillPrice}`);
      
    } catch (error) {
      order.status = 'rejected';
      order.updatedAt = new Date();
      order.metadata = { ...order.metadata, rejectionReason: (error as Error).message };
      
      console.error(`❌ Order ${order.id} execution failed:`, error);
    }
  }  /**
   * Simulate order execution with realistic market conditions
   */
  private async simulateOrderExecution(order: AdvancedOrder, marketPrice: number): Promise<{
    status: OrderStatus;
    filledQuantity: number;
    avgFillPrice: number;
    fees: number;
    executedAt: Date;
  }> {
    const { type, side, quantity, price, stopPrice } = order;
    let executionPrice = marketPrice;
    let shouldExecute = false;

    // Determine if order should execute based on type
    switch (type) {
      case 'market':
        shouldExecute = true;
        executionPrice = marketPrice + (side === 'buy' ? 0.0001 : -0.0001); // Simulate slippage
        break;
        
      case 'limit':
        if (price) {
          shouldExecute = side === 'buy' ? marketPrice <= price : marketPrice >= price;
          executionPrice = price;
        }
        break;
        
      case 'stop':
        if (stopPrice) {
          shouldExecute = side === 'buy' ? marketPrice >= stopPrice : marketPrice <= stopPrice;
          executionPrice = marketPrice;
        }
        break;
        
      case 'stop-limit':
        if (stopPrice && price) {
          const stopTriggered = side === 'buy' ? marketPrice >= stopPrice : marketPrice <= stopPrice;
          if (stopTriggered) {
            shouldExecute = side === 'buy' ? marketPrice <= price : marketPrice >= price;
            executionPrice = price;
          }
        }
        break;
    }

    if (!shouldExecute) {
      return {
        status: 'pending',
        filledQuantity: 0,
        avgFillPrice: 0,
        fees: 0,
        executedAt: new Date(),
      };
    }

    // Calculate fees (0.1% for simulation)
    const notionalValue = quantity * executionPrice;
    const fees = notionalValue * 0.001;

    return {
      status: 'filled',
      filledQuantity: quantity,
      avgFillPrice: executionPrice,
      fees,
      executedAt: new Date(),
    };
  }  /**
   * Get current market price for a symbol
   */
  private getCurrentMarketPrice(symbol: string): number | null {
    const state = store.getState();
    const symbolData = state.market.symbols.find(s => s.id === symbol);
    return symbolData?.price || null;
  }

  /**
   * Calculate realistic execution delay based on order type and market conditions
   */
  private calculateExecutionDelay(order: AdvancedOrder): number {
    const baseDelay = {
      'market': 50, // 50ms for market orders
      'limit': 100,
      'stop': 80,
      'stop-limit': 120,
      'trailing-stop': 150,
      'oco': 200,
      'bracket': 250,
      'iceberg': 300,
      'fill-or-kill': 30,
      'immediate-or-cancel': 25,
    }[order.type] || 100;

    // Add priority multiplier
    const priorityMultiplier = {
      'urgent': 0.5,
      'high': 0.7,
      'normal': 1.0,
      'low': 1.5,
    }[order.priority];

    return Math.floor(baseDelay * priorityMultiplier);
  }

  /**
   * Update queue processing statistics
   */
  private updateQueueStats(processedCount: number, executionTime: number): void {
    const processingRate = processedCount / (executionTime / 1000); // orders per second
    this.queueStats.queueProcessingRate = 
      (this.queueStats.queueProcessingRate * 0.8) + (processingRate * 0.2); // Exponential average
    
    this.queueStats.lastProcessedTime = new Date();
    this.queueStats.averageExecutionTime = 
      (this.queueStats.averageExecutionTime * 0.9) + (executionTime / processedCount * 0.1);
  }

  /**
   * Bulk cancel orders by criteria
   */
  public async cancelOrdersBulk(criteria: {
    symbol?: string;
    side?: 'buy' | 'sell';
    olderThan?: Date;
  }): Promise<string[]> {
    const ordersToCancel = this.getOrders({
      symbol: criteria.symbol,
      side: criteria.side,
      status: 'pending',
      dateTo: criteria.olderThan,
    });

    const cancelledIds: string[] = [];
    for (const order of ordersToCancel) {
      try {
        await this.cancelOrder(order.id, 'Bulk cancellation');
        cancelledIds.push(order.id);
      } catch (error) {
        console.error(`Failed to cancel order ${order.id}:`, error);
      }
    }

    console.log(`🔄 Bulk cancelled ${cancelledIds.length} orders`);
    return cancelledIds;
  }

  /**
   * Get orders grouped by status for dashboard
   */
  public getOrderSummary(): {
    byStatus: Record<OrderStatus, AdvancedOrder[]>;
    bySymbol: Record<string, AdvancedOrder[]>;
    recentActivity: AdvancedOrder[];
  } {
    const orders = Array.from(this.orders.values());
    
    const byStatus: Record<string, AdvancedOrder[]> = {};
    const bySymbol: Record<string, AdvancedOrder[]> = {};
    
    for (const order of orders) {
      // Group by status
      if (!byStatus[order.status]) byStatus[order.status] = [];
      byStatus[order.status].push(order);
      
      // Group by symbol
      if (!bySymbol[order.symbol]) bySymbol[order.symbol] = [];
      bySymbol[order.symbol].push(order);
    }

    const recentActivity = orders
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 20);

    return {
      byStatus: byStatus as Record<OrderStatus, AdvancedOrder[]>,
      bySymbol,
      recentActivity,
    };
  }
}

// Create singleton instance
export const orderManager = new AdvancedOrderManager();

// Export class and instance
export { AdvancedOrderManager };
export default orderManager;