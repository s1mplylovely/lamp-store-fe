export const OPEN_AUTH_MODAL = 'ui/OPEN_AUTH_MODAL';
export const CLOSE_AUTH_MODAL = 'ui/CLOSE_AUTH_MODAL';
export const SHOW_NOTIFICATION = 'ui/SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = 'ui/HIDE_NOTIFICATION';

export const openAuthModal = (message = '') => ({ type: OPEN_AUTH_MODAL, payload: message });
export const closeAuthModal = () => ({ type: CLOSE_AUTH_MODAL });

export const showNotification = (message, severity = 'info') => ({
  type: SHOW_NOTIFICATION,
  payload: { message, severity },
});

export const hideNotification = () => ({ type: HIDE_NOTIFICATION });