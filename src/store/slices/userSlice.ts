import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences } from '../../types';

const initialState: User = {
  id: 'demo-user',
  name: 'Demo Trader',
  email: 'demo@tradingplatform.com',
  balance: 50000,
  equity: 52340.75,
  freeMargin: 48200.00,
  usedMargin: 4140.75,
  pl: 2340.75,
  subscriptions: [],
  favorites: [],
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
    availableBalance: 48200.00,
    investedAmount: 1200.00,
    totalPnl: 2340.75,
    totalWithdrawals: 5000.00,
    totalDeposits: 55000.00,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateBalance: (state, action: PayloadAction<{ balance: number; equity: number; pl: number }>) => {
      const { balance, equity, pl } = action.payload;
      state.balance = balance;
      state.equity = equity;
      state.pl = pl;
      state.freeMargin = equity - state.usedMargin;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      const symbolId = action.payload;
      if (!state.favorites.includes(symbolId)) {
        state.favorites.push(symbolId);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const symbolId = action.payload;
      state.favorites = state.favorites.filter(id => id !== symbolId);
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    followProvider: (state, action: PayloadAction<{ providerId: string; allocation: number }>) => {
      const { providerId, allocation } = action.payload;
      const existingSubscription = state.subscriptions.find(sub => sub.providerId === providerId);
      
      if (!existingSubscription) {
        state.subscriptions.push({
          providerId,
          allocation,
          followedAt: new Date(),
          performance: 0,
          totalReturn: 0,
        });
      }
    },
    unfollowProvider: (state, action: PayloadAction<string>) => {
      const providerId = action.payload;
      state.subscriptions = state.subscriptions.filter(sub => sub.providerId !== providerId);
    },
    updateSubscriptionPerformance: (state, action: PayloadAction<{ providerId: string; performance: number; totalReturn: number }>) => {
      const { providerId, performance, totalReturn } = action.payload;
      const subscription = state.subscriptions.find(sub => sub.providerId === providerId);
      if (subscription) {
        subscription.performance = performance;
        subscription.totalReturn = totalReturn;
      }
    },
  },
});

export const {
  updateBalance,
  addToFavorites,
  removeFromFavorites,
  updatePreferences,
  followProvider,
  unfollowProvider,
  updateSubscriptionPerformance,
} = userSlice.actions;

export default userSlice.reducer;