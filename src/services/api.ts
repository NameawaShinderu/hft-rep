import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Symbol, SignalProvider, User, APIResponse, PaginatedResponse } from '../types';
import { generateMarketData } from './mockData';

// Mock API base URL
const API_BASE_URL = '/api/v1';

// Create RTK Query API service
export const tradingApi = createApi({
  reducerPath: 'tradingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    // Simulate API delays for realistic experience
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Symbol', 'SignalProvider', 'User', 'Order'],
  endpoints: (builder) => ({
    // Market Data Endpoints
    getMarketData: builder.query<APIResponse<Symbol[]>, void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const symbols = generateMarketData();
        return {
          data: {
            data: symbols,
            success: true,
            message: 'Market data retrieved successfully',
            timestamp: new Date(),
          }
        };
      },
      providesTags: ['Symbol'],
    }),

    // Signal Provider Endpoints
    getSignalProviders: builder.query<APIResponse<SignalProvider[]>, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Generate realistic signal provider data
        const providers: SignalProvider[] = [
          {
            id: 'SP001',
            name: 'FX Master Pro',
            rank: 1,
            growth: 234.5,
            weeks: 52,
            followers: 1247,
            drawdown: 8.2,
            fund: 125000,
            riskLevel: 3,
            isFollowed: false,
            performanceHistory: Array.from({ length: 52 }, (_, _i) => 100 + Math.random() * 150),
            sparklineData: Array.from({ length: 20 }, (_, i) => 50 + Math.sin(i * 0.5) * 10 + Math.random() * 5),
            description: 'Professional forex trader with 8+ years experience',
            createdAt: new Date('2023-01-15'),
            lastActive: new Date(),
          },
          {
            id: 'SP002', 
            name: 'Crypto Whale',
            rank: 2,
            growth: 189.3,
            weeks: 34,
            followers: 892,
            drawdown: 12.5,
            fund: 89000,
            riskLevel: 4,
            isFollowed: true,
            performanceHistory: Array.from({ length: 34 }, (_, _i) => 100 + Math.random() * 200),
            sparklineData: Array.from({ length: 20 }, (_, i) => 60 + Math.cos(i * 0.3) * 15 + Math.random() * 8),
            description: 'Crypto specialist focusing on major altcoins',
            createdAt: new Date('2023-06-01'),
            lastActive: new Date(),
          },
          {
            id: 'SP003',
            name: 'Index Hunter',
            rank: 3,
            growth: 156.7,
            weeks: 78,
            followers: 2134,
            drawdown: 5.8,
            fund: 340000,
            riskLevel: 2,
            isFollowed: false,
            performanceHistory: Array.from({ length: 78 }, (_, _i) => 100 + Math.random() * 80),
            sparklineData: Array.from({ length: 20 }, (_, i) => 45 + Math.sin(i * 0.7) * 8 + Math.random() * 3),
            description: 'Conservative index trader with steady returns',
            createdAt: new Date('2022-08-20'),
            lastActive: new Date(),
          },
        ];

        return {
          data: {
            data: providers,
            success: true,
            message: 'Signal providers retrieved successfully',
            timestamp: new Date(),
          }
        };
      },
      providesTags: ['SignalProvider'],
    }),

    // User Data Endpoints
    getUserData: builder.query<APIResponse<User>, string>({
      queryFn: async (userId) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const userData: User = {
          id: userId,
          name: 'John Trader',
          email: 'john@trader.com',
          balance: 50000.00,
          equity: 52340.50,
          freeMargin: 48765.30,
          usedMargin: 3575.20,
          pl: 2340.50,
          subscriptions: [
            {
              providerId: 'SP002',
              allocation: 25,
              followedAt: new Date('2024-01-15'),
              performance: 18.5,
              totalReturn: 4625.00,
            },
          ],
          favorites: ['EURUSD', 'BTCUSD', 'XAUUSD', 'SPX500'],
          preferences: {
            theme: 'dark',
            sidebarCollapsed: false,
            notifications: true,
            soundAlerts: false,
            defaultView: 'all',
            tablePageSize: 20,
            currency: 'USD',
          },
          // Add missing properties
          pammSubscriptions: [],
          wallet: {
            totalBalance: 50000.00,
            availableBalance: 48765.30,
            investedAmount: 1200.00,
            totalPnl: 2340.50,
            totalWithdrawals: 15000.00,
            totalDeposits: 65000.00,
          },
        };

        return {
          data: {
            data: userData,
            success: true,
            message: 'User data retrieved successfully', 
            timestamp: new Date(),
          }
        };
      },
      providesTags: ['User'],
    }),

    // Order History Endpoint
    getOrderHistory: builder.query<APIResponse<PaginatedResponse<any>>, { page?: number; limit?: number }>({
      queryFn: async ({ page = 1, limit = 20 }) => {
        await new Promise(resolve => setTimeout(resolve, 120));
        
        // Generate mock order history
        const orders = Array.from({ length: 150 }, (_, i) => ({
          id: `ORD${String(i + 1).padStart(6, '0')}`,
          symbol: ['EURUSD', 'BTCUSD', 'XAUUSD', 'GBPJPY', 'SPX500'][Math.floor(Math.random() * 5)],
          type: Math.random() > 0.5 ? 'BUY' : 'SELL',
          volume: Math.floor(Math.random() * 10) + 1,
          openPrice: 1.0845 + (Math.random() - 0.5) * 0.1,
          currentPrice: 1.0845 + (Math.random() - 0.5) * 0.1,
          pl: (Math.random() - 0.5) * 1000,
          swap: Math.random() * 10 - 5,
          commission: Math.random() * 5,
          openTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          status: ['OPEN', 'CLOSED', 'PENDING'][Math.floor(Math.random() * 3)],
        }));

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedOrders = orders.slice(startIndex, endIndex);

        return {
          data: {
            data: {
              items: paginatedOrders,
              totalItems: orders.length,
              totalPages: Math.ceil(orders.length / limit),
              currentPage: page,
              itemsPerPage: limit,
            },
            success: true,
            message: 'Order history retrieved successfully',
            timestamp: new Date(),
          }
        };
      },
      providesTags: ['Order'],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetMarketDataQuery,
  useGetSignalProvidersQuery,
  useGetUserDataQuery,
  useGetOrderHistoryQuery,
} = tradingApi;