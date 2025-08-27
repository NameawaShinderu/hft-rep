import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketWatchState, Symbol } from '../../types';

const initialState: MarketWatchState = {
  symbols: [],
  loading: false,
  error: null,
  searchTerm: '',
  activeTab: 'all',
  currentPage: 1,
  itemsPerPage: 20,
  sortBy: null,
  sortDirection: 'asc',
  filters: {},
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setSymbols: (state, action: PayloadAction<Symbol[]>) => {
      state.symbols = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateSymbolPrice: (state, action: PayloadAction<{ id: string; price: number; change: number }>) => {
      const { id, price, change } = action.payload;
      const symbolIndex = state.symbols.findIndex(s => s.id === id);
      if (symbolIndex !== -1) {
        state.symbols[symbolIndex].price = price;
        state.symbols[symbolIndex].change = change;
        state.symbols[symbolIndex].changePercent = (change / (price - change)) * 100;
        state.symbols[symbolIndex].lastUpdate = new Date();
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page on search
    },
    setActiveTab: (state, action: PayloadAction<'favorites' | 'all'>) => {
      state.activeTab = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: keyof Symbol; sortDirection: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const symbolId = action.payload;
      const symbolIndex = state.symbols.findIndex(s => s.id === symbolId);
      if (symbolIndex !== -1) {
        state.symbols[symbolIndex].isFavorite = !state.symbols[symbolIndex].isFavorite;
      }
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
  setSymbols,
  updateSymbolPrice,
  setSearchTerm,
  setActiveTab,
  setCurrentPage,
  setSorting,
  toggleFavorite,
  setLoading,
  setError,
} = marketSlice.actions;

export default marketSlice.reducer;