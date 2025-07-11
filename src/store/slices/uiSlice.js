import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showForgotPassword: false,
  showResetPassword: false,
  
  globalLoading: false,
  
  notifications: [],
  
  darkMode: false,
  
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showForgotPassword: (state) => {
      state.showForgotPassword = true;
    },
    hideForgotPassword: (state) => {
      state.showForgotPassword = false;
    },
    showResetPassword: (state) => {
      state.showResetPassword = true;
    },
    hideResetPassword: (state) => {
      state.showResetPassword = false;
    },
    
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    
    addNotification: (state, action) => {
      const { id, type, message, duration = 5000 } = action.payload;
      state.notifications.push({ id, type, message, duration });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    
    clearUI: (state) => {
      state.showForgotPassword = false;
      state.showResetPassword = false;
      state.globalLoading = false;
      state.notifications = [];
      state.mobileMenuOpen = false;
    },
  },
});

export const {
  showForgotPassword,
  hideForgotPassword,
  showResetPassword,
  hideResetPassword,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleDarkMode,
  setDarkMode,
  toggleMobileMenu,
  closeMobileMenu,
  clearUI,
} = uiSlice.actions;

// Selectors
export const selectShowForgotPassword = (state) => state.ui.showForgotPassword;
export const selectShowResetPassword = (state) => state.ui.showResetPassword;
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;

export default uiSlice.reducer; 