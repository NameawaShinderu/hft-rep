import { configureStore } from '@reduxjs/toolkit';
import { tradingApi } from '../services/api';
import marketSlice from './slices/marketSlice';
import mamSlice from './slices/mamSlice';
import uiSlice from './slices/uiSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    market: marketSlice,
    mam: mamSlice,
    ui: uiSlice,
    user: userSlice,
    // Add RTK Query API reducer
    [tradingApi.reducerPath]: tradingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    })
    // Add RTK Query middleware
    .concat(tradingApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
export { useAppDispatch, useAppSelector } from './hooks';