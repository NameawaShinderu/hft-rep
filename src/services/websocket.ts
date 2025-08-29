import { store } from '../store';
import { updateSymbolPrice, updateMultipleSymbolPrices } from '../store/slices/marketSlice';

interface WebSocketMessage {
  type: 'PRICE_UPDATE' | 'SYMBOL_UPDATE' | 'MARKET_STATUS' | 'ERROR';
  payload: any;
}

interface PriceUpdatePayload {
  symbol: string;
  bid: number;
  ask: number;
  timestamp: number;
}

interface BulkPriceUpdatePayload {
  updates: PriceUpdatePayload[];
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private isIntentionallyClosed = false;
  private subscribers = new Map<string, Set<(data: any) => void>>();

  // WebSocket connection URLs (configurable for different environments)
  private readonly urls = {
    development: 'ws://localhost:8080',
    production: 'wss://api.hft-platform.com/ws',
    demo: 'wss://demo-api.hft-platform.com/ws'
  };

  constructor() {
    this.connect();
  }

  /**
   * Establish WebSocket connection with automatic reconnection
   */  private connect(): void {
    const environment = process.env.NODE_ENV as keyof typeof this.urls || 'development';
    const wsUrl = this.urls[environment];
    
    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
      console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Set up WebSocket event listeners
   */
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }

  /**
   * Handle WebSocket connection open
   */
  private handleOpen(): void {
    console.log('✅ WebSocket connected');
    this.reconnectAttempts = 0;
    this.isIntentionallyClosed = false;
    
    // Start heartbeat ping
    this.startPing();
    
    // Subscribe to all symbols for real-time updates
    this.subscribeToMarketData();
    
    // Notify subscribers of connection
    this.notifySubscribers('connection', { status: 'connected' });
  }
  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'PRICE_UPDATE':
          this.handlePriceUpdate(message.payload as PriceUpdatePayload);
          break;
          
        case 'SYMBOL_UPDATE':
          this.handleBulkPriceUpdate(message.payload as BulkPriceUpdatePayload);
          break;
          
        case 'MARKET_STATUS':
          this.handleMarketStatus(message.payload);
          break;
          
        case 'ERROR':
          console.error('🚨 WebSocket server error:', message.payload);
          break;
          
        default:
          console.warn('⚠️  Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('❌ Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Handle individual symbol price updates
   */
  private handlePriceUpdate(payload: PriceUpdatePayload): void {
    const { symbol, bid, ask, timestamp } = payload;
    
    // Calculate mid price
    const price = (bid + ask) / 2;
    
    // Update Redux store
    store.dispatch(updateSymbolPrice({
      id: symbol,
      price,
      change: 0, // Will be calculated by the reducer
    }));
    
    // Notify subscribers
    this.notifySubscribers('priceUpdate', { symbol, price, bid, ask, timestamp });
  }
  /**
   * Handle bulk symbol price updates
   */
  private handleBulkPriceUpdate(payload: BulkPriceUpdatePayload): void {
    const updates = payload.updates.map(update => ({
      symbolId: update.symbol,
      price: (update.bid + update.ask) / 2,
      bid: update.bid,
      ask: update.ask,
      spread: ((update.ask - update.bid) / ((update.bid + update.ask) / 2)) * 10000,
      timestamp: new Date(update.timestamp),
    }));
    
    // Batch update Redux store
    store.dispatch(updateMultipleSymbolPrices(updates));
    
    // Notify subscribers
    this.notifySubscribers('bulkPriceUpdate', { updates });
  }

  /**
   * Handle market status updates
   */
  private handleMarketStatus(payload: any): void {
    console.log('📈 Market status update:', payload);
    this.notifySubscribers('marketStatus', payload);
  }

  /**
   * Handle WebSocket connection close
   */
  private handleClose(event: CloseEvent): void {
    console.log('🔌 WebSocket disconnected:', event.code, event.reason);
    
    this.clearTimers();
    
    if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
    
    // Notify subscribers of disconnection
    this.notifySubscribers('connection', { status: 'disconnected', code: event.code });
  }
  /**
   * Handle WebSocket errors
   */
  private handleError(event: Event): void {
    console.error('🚨 WebSocket error:', event);
    this.notifySubscribers('error', { event });
  }

  /**
   * Schedule automatic reconnection
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, Math.min(this.reconnectAttempts - 1, 4)); // Exponential backoff
    
    console.log(`🔄 Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Start heartbeat ping to keep connection alive
   */
  private startPing(): void {
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'PING' }));
      }
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
  /**
   * Subscribe to market data for all symbols
   */
  private subscribeToMarketData(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const subscribeMessage = {
        type: 'SUBSCRIBE',
        payload: {
          channels: ['market_data', 'symbol_updates'],
          symbols: 'ALL', // Subscribe to all symbols
        }
      };
      this.ws.send(JSON.stringify(subscribeMessage));
      console.log('📡 Subscribed to market data channels');
    }
  }

  /**
   * Subscribe to specific events
   */
  public subscribe(eventType: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    const eventSubscribers = this.subscribers.get(eventType)!;
    eventSubscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      eventSubscribers.delete(callback);
      if (eventSubscribers.size === 0) {
        this.subscribers.delete(eventType);
      }
    };
  }

  /**
   * Notify all subscribers of an event
   */
  private notifySubscribers(eventType: string, data: any): void {
    const eventSubscribers = this.subscribers.get(eventType);
    if (eventSubscribers) {
      eventSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${eventType} subscriber:`, error);
        }
      });
    }
  }
  /**
   * Send message to WebSocket server
   */
  public send(message: WebSocketMessage): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('❌ Failed to send WebSocket message:', error);
        return false;
      }
    } else {
      console.warn('⚠️  WebSocket not connected. Message queued for retry.');
      return false;
    }
  }

  /**
   * Subscribe to specific symbol updates
   */
  public subscribeToSymbol(symbol: string): void {
    this.send({
      type: 'SYMBOL_UPDATE',
      payload: {
        action: 'SUBSCRIBE',
        symbol: symbol.toUpperCase(),
      }
    });
  }

  /**
   * Unsubscribe from specific symbol updates
   */
  public unsubscribeFromSymbol(symbol: string): void {
    this.send({
      type: 'SYMBOL_UPDATE', 
      payload: {
        action: 'UNSUBSCRIBE',
        symbol: symbol.toUpperCase(),
      }
    });
  }

  /**
   * Get current connection status
   */
  public getConnectionStatus(): {
    status: 'connecting' | 'connected' | 'disconnected' | 'error';
    reconnectAttempts: number;
    lastError?: string;
  } {
    if (!this.ws) {
      return { status: 'disconnected', reconnectAttempts: this.reconnectAttempts };
    }
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return { status: 'connecting', reconnectAttempts: this.reconnectAttempts };
      case WebSocket.OPEN:
        return { status: 'connected', reconnectAttempts: this.reconnectAttempts };
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return { status: 'disconnected', reconnectAttempts: this.reconnectAttempts };
      default:
        return { status: 'error', reconnectAttempts: this.reconnectAttempts };
    }
  }
  /**
   * Manually disconnect WebSocket
   */
  public disconnect(): void {
    this.isIntentionallyClosed = true;
    this.clearTimers();
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    
    console.log('🔌 WebSocket manually disconnected');
    this.notifySubscribers('connection', { status: 'disconnected', manual: true });
  }

  /**
   * Force reconnection
   */
  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    
    setTimeout(() => {
      this.isIntentionallyClosed = false;
      this.connect();
    }, 1000);
  }

  /**
   * Check if WebSocket is currently connected
   */
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get detailed connection info for debugging
   */
  public getDebugInfo(): object {
    return {
      connectionStatus: this.getConnectionStatus(),
      subscriberCount: Array.from(this.subscribers.entries()).map(([event, subs]) => ({
        event,
        subscriberCount: subs.size
      })),
      wsReadyState: this.ws?.readyState,
      reconnectAttempts: this.reconnectAttempts,
      isIntentionallyClosed: this.isIntentionallyClosed,
    };
  }

  /**
   * Clean up resources on destruction
   */
  public destroy(): void {
    this.disconnect();
    this.subscribers.clear();
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// Export service for use in components
export default webSocketService;