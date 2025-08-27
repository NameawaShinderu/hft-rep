import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MAMState, SignalProvider } from '../../types';

const initialState: MAMState = {
  providers: [],
  loading: false,
  error: null,
  sortBy: null,
  sortDirection: 'asc',
  filters: {},
};

const mamSlice = createSlice({
  name: 'mam',
  initialState,
  reducers: {
    setProviders: (state, action: PayloadAction<SignalProvider[]>) => {
      state.providers = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateProviderPerformance: (state, action: PayloadAction<{ id: string; growth: number }>) => {
      const { id, growth } = action.payload;
      const providerIndex = state.providers.findIndex(p => p.id === id);
      if (providerIndex !== -1) {
        state.providers[providerIndex].growth = growth;
        // Update performance history
        if (state.providers[providerIndex].performanceHistory.length > 50) {
          state.providers[providerIndex].performanceHistory.shift();
        }
        state.providers[providerIndex].performanceHistory.push(growth);
      }
    },
    toggleFollowProvider: (state, action: PayloadAction<string>) => {
      const providerId = action.payload;
      const providerIndex = state.providers.findIndex(p => p.id === providerId);
      if (providerIndex !== -1) {
        const currentlyFollowed = state.providers[providerIndex].isFollowed;
        state.providers[providerIndex].isFollowed = !currentlyFollowed;
        
        // Update follower count
        if (!currentlyFollowed) {
          state.providers[providerIndex].followers += 1;
        } else {
          state.providers[providerIndex].followers = Math.max(0, state.providers[providerIndex].followers - 1);
        }
      }
    },
    setSorting: (state, action: PayloadAction<{ sortBy: keyof SignalProvider; sortDirection: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
    setFilters: (state, action: PayloadAction<MAMState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setProviders,
  updateProviderPerformance,
  toggleFollowProvider,
  setSorting,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = mamSlice.actions;

export default mamSlice.reducer;