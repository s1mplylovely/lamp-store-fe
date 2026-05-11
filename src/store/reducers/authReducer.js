import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  VERIFY_CODE_REQUEST,
  VERIFY_CODE_SUCCESS,
  VERIFY_CODE_FAILURE,
  FETCH_ME_REQUEST,
  FETCH_ME_SUCCESS,
  FETCH_ME_FAILURE,
  LOGOUT,
} from '../actions/authActions';

const initialState = {
  currentUser: null,
  signupUuid: null,
  signupRole: 'client',
  devCode: null,
  loading: false,
  error: null,
};

export function mapUser(u) {
  if (!u) return null;
  return {
    id: u.uuid,
    uuid: u.uuid,
    name: u.name ?? '',
    email: u.email ?? '',
    phone: u.phone ?? '',
    isAdmin: u.role === 'admin',
    isBlocked: u.is_blocked ?? false,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  };
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    // Signup
    case SIGNUP_REQUEST:
      return { ...state, loading: true, error: null };

    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        signupUuid: action.payload.uuid,
        signupRole: action.payload.role ?? 'client',
        devCode: action.payload.login_code ?? null,
      };

    case SIGNUP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Verify code
    case VERIFY_CODE_REQUEST:
      return { ...state, loading: true, error: null };

    case VERIFY_CODE_SUCCESS:
      return { ...state, loading: false, signupUuid: null, signupRole: 'client', devCode: null };

    case VERIFY_CODE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Fetch current user
    case FETCH_ME_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ME_SUCCESS:
      return { ...state, loading: false, currentUser: mapUser(action.payload) };

    case FETCH_ME_FAILURE:
      return { ...state, loading: false, currentUser: null };

    // Logout
    case LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
}