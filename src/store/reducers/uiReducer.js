import {
  OPEN_AUTH_MODAL,
  CLOSE_AUTH_MODAL,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
} from '../actions/uiActions';

const initialState = {
  authModal: {
    open: false,
    message: '',
  },
  notification: {
    open: false,
    message: '',
    severity: 'info', // 'success' | 'error' | 'warning' | 'info'
  },
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_AUTH_MODAL:
      return {
        ...state,
        authModal: { open: true, message: action.payload ?? '' },
      };

    case CLOSE_AUTH_MODAL:
      return {
        ...state,
        authModal: { open: false, message: '' },
      };

    case SHOW_NOTIFICATION:
      return {
        ...state,
        notification: {
          open: true,
          message: action.payload.message,
          severity: action.payload.severity ?? 'info',
        },
      };

    case HIDE_NOTIFICATION:
      return {
        ...state,
        notification: { ...state.notification, open: false },
      };

    default:
      return state;
  }
}