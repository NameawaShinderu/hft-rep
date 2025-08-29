import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, NotificationState } from '../../types';

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'dark',
  notifications: [],
  modals: {
    shortcuts: false,
    settings: false,
  },
  loading: {
    global: false,
    market: false,
    mam: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light' | 'system'>) => {
      state.theme = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<NotificationState, 'id' | 'timestamp' | 'dismissed'>>) => {
      const notification: NotificationState = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        dismissed: false,
      };
      state.notifications.push(notification);
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
      if (notificationIndex !== -1) {
        state.notifications[notificationIndex].dismissed = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      const modalName = action.payload;
      if (modalName in state.modals) {
        (state.modals as any)[modalName] = true;
      }
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      const modalName = action.payload;
      if (modalName in state.modals) {
        (state.modals as any)[modalName] = false;
      }
    },
    setLoading: (state, action: PayloadAction<{ type: keyof UIState['loading']; loading: boolean }>) => {
      const { type, loading } = action.payload;
      state.loading[type] = loading;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  dismissNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;