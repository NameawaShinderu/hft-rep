import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setError } from '../store/slices/marketSlice';
import webSocketService from '../services/websocket';

interface WebSocketConnection {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  reconnectAttempts: number;
  lastError?: string;
}

interface UseWebSocketReturn {
  connection: WebSocketConnection;
  subscribe: (eventType: string, callback: (data: any) => void) => (() => void);
  subscribeToSymbol: (symbol: string) => void;
  unsubscribeFromSymbol: (symbol: string) => void;
  send: (message: any) => boolean;
  reconnect: () => void;
  disconnect: () => void;
}

/**
 * Custom hook for WebSocket integration
 * Provides real-time market data and connection management
 */
export const useWebSocket = (): UseWebSocketReturn => {
  const dispatch = useAppDispatch();
  const [connection, setConnection] = useState<WebSocketConnection>(() =>
    webSocketService.getConnectionStatus()
  );
  
  // Store active subscriptions for cleanup
  const subscriptionsRef = useRef<Map<string, () => void>>(new Map());

  // Update connection status when it changes
  useEffect(() => {
    const unsubscribe = webSocketService.subscribe('connection', (data) => {
      const newStatus = data.status === 'connected' ? 'connected' : 'disconnected';
      setConnection(prev => ({
        ...prev,
        status: newStatus,
        reconnectAttempts: webSocketService.getConnectionStatus().reconnectAttempts,
      }));
    });

    // Handle WebSocket errors
    const unsubscribeError = webSocketService.subscribe('error', (_data) => {
      dispatch(setError('WebSocket connection error occurred'));
      setConnection(prev => ({
        ...prev,
        status: 'error',
        lastError: 'Connection error',
      }));
    });

    return () => {
      unsubscribe();
      unsubscribeError();
    };
  }, [dispatch]);
  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      // Clean up all active subscriptions
      subscriptionsRef.current.forEach(unsubscribe => unsubscribe());
      subscriptionsRef.current.clear();
    };
  }, []);

  // Public interface functions
  const subscribe = useCallback((eventType: string, callback: (data: any) => void): (() => void) => {
    const unsubscribe = webSocketService.subscribe(eventType, callback);
    
    // Store the unsubscribe function for cleanup
    const subscriptionKey = `${eventType}_${Date.now()}_${Math.random()}`;
    subscriptionsRef.current.set(subscriptionKey, unsubscribe);
    
    // Return enhanced unsubscribe that also cleans up our reference
    return () => {
      unsubscribe();
      subscriptionsRef.current.delete(subscriptionKey);
    };
  }, []);

  const subscribeToSymbol = useCallback((symbol: string) => {
    webSocketService.subscribeToSymbol(symbol);
  }, []);

  const unsubscribeFromSymbol = useCallback((symbol: string) => {
    webSocketService.unsubscribeFromSymbol(symbol);
  }, []);

  const send = useCallback((message: any): boolean => {
    return webSocketService.send(message);
  }, []);

  const reconnect = useCallback(() => {
    webSocketService.reconnect();
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  return {
    connection,
    subscribe,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    send,
    reconnect,
    disconnect,
  };
};
