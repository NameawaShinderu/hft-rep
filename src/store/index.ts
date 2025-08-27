import { configureStore } from '@reduxjs/toolkit';
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
export { useAppDispatch, useAppSelector } from './hooks';