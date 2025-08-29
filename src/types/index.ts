// Core trading platform types

export interface Symbol {
  id: string;
  name: string;
  displayName: string;
  category: 'forex' | 'crypto' | 'commodity' | 'index' | 'stock';
  price: number;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  lastUpdate: Date;
  isFavorite?: boolean;
  sparklineData?: number[];
}

export interface SignalProvider {
  id: string;
  name: string;
  rank: number;
  growth: number;
  weeks: number;
  followers: number;
  drawdown: number;
  fund: number;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  isFollowed: boolean;
  performanceHistory: number[];
  avatar?: string;
  description?: string;
  createdAt: Date;
  lastActive: Date;
  // Enhanced PAMM fields
  sparklineData: number[];
  investment?: number; // Amount invested by current user
  sharedPnl?: number; // P&L from this provider
  netAmount?: number; // Total return including investment
  allocationPercent?: number; // Percentage of portfolio allocated
}

export interface PAMMSubscription {
  id: string;
  providerId: string;
  providerName: string;
  investment: number;
  sharedPnl: number;
  netAmount: number;
  allocationPercent: number;
  subscribedAt: Date;
  lastUpdate: Date;
  status: 'active' | 'paused' | 'closed';
  performanceHistory: number[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'crypto' | 'bank' | 'digital_wallet' | 'card';
  icon: string;
  minimumDeposit: number;
  maximumDeposit?: number;
  processingTime: string;
  fee: number; // percentage
  isAvailable: boolean;
  description?: string;
}

export interface MAMSubscription {
  providerId: string;
  allocation: number; // percentage
  followedAt: Date;
  performance: number;
  totalReturn: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  equity: number;
  freeMargin: number;
  usedMargin: number;
  pl: number;
  subscriptions: MAMSubscription[];
  favorites: string[]; // symbol IDs
  preferences: UserPreferences;
  // Enhanced wallet fields
  pammSubscriptions: PAMMSubscription[];
  wallet: {
    totalBalance: number;
    availableBalance: number;
    investedAmount: number;
    totalPnl: number;
    totalWithdrawals: number;
    totalDeposits: number;
  };
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit_share' | 'fee';
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: Date;
  description?: string;
  txHash?: string; // For crypto transactions
  fee?: number;
}

export interface DepositRequest {
  paymentMethodId: string;
  amount: number;
  currency: string;
  note?: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  sidebarCollapsed: boolean;
  notifications: boolean;
  soundAlerts: boolean;
  defaultView: 'favorites' | 'all';
  tablePageSize: number;
  currency: 'USD' | 'EUR' | 'GBP';
}// UI State and Component Types

export interface MarketWatchState {
  symbols: Symbol[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  activeTab: 'favorites' | 'all';
  currentPage: number;
  itemsPerPage: number;
  sortBy: keyof Symbol | null;
  sortDirection: 'asc' | 'desc';
  filters: {
    category?: Symbol['category'];
    minChange?: number;
    maxChange?: number;
    minVolume?: number;
  };
}

export interface MAMState {
  providers: SignalProvider[];
  loading: boolean;
  error: string | null;
  sortBy: keyof SignalProvider | null;
  sortDirection: 'asc' | 'desc';
  filters: {
    minFollowers?: number;
    maxDrawdown?: number;
    riskLevel?: SignalProvider['riskLevel'];
    minGrowth?: number;
  };
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light' | 'system';
  notifications: NotificationState[];
  modals: {
    confirmFollow?: {
      open: boolean;
      providerId?: string;
    };
    shortcuts?: boolean;
    settings?: boolean;
  };
  loading: {
    global: boolean;
    market: boolean;
    mam: boolean;
  };
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
  dismissed: boolean;
}

// API Types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  volume?: number;
}
// Order Management Types
export type OrderStatus = 
  | 'pending'
  | 'filled'
  | 'partial'
  | 'cancelled'
  | 'rejected'
  | 'expired';

export type OrderType = 
  | 'market'
  | 'limit'
  | 'stop'
  | 'stop-limit';

export interface Order {
  id: string;
  symbol: string;
  type: OrderType;
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: OrderStatus;
  filledQuantity: number;
  avgFillPrice?: number;
  fees: number;
  createdAt: Date;
  updatedAt: Date;
  executedAt?: Date;
}

// Enhanced market data state
export interface MarketWatchState {
  symbols: Symbol[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  activeTab: 'favorites' | 'all';
  currentPage: number;
  itemsPerPage: number;
  sortBy: keyof Symbol | null;
  sortDirection: 'asc' | 'desc';
  filters: Record<string, any>;
  lastUpdate?: Date;
  connectionStatus?: 'connected' | 'disconnected' | 'connecting';
}