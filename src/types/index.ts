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
  theme: 'dark' | 'light';
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