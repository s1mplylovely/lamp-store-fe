import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
} from '../actions/userActions';

const initialState = {
  items: [],
  total: 0,
  current: null,
  loading: false,
  saving: false,
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
    role: u.role,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  };
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    // Список
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.users.map(mapUser),
        total: action.payload.total ?? 0,
      };

    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Один
    case FETCH_USER_REQUEST:
      return { ...state, loading: true, current: null, error: null };

    case FETCH_USER_SUCCESS:
      return { ...state, loading: false, current: mapUser(action.payload) };

    case FETCH_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Create
    case CREATE_USER_REQUEST:
      return { ...state, saving: true, error: null };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        saving: false,
        items: [...state.items, mapUser(action.payload)],
      };

    case CREATE_USER_FAILURE:
      return { ...state, saving: false, error: action.payload };

    // Update
    case UPDATE_USER_REQUEST:
      return { ...state, saving: true, error: null };

    case UPDATE_USER_SUCCESS: {
      const updated = mapUser(action.payload);
      return {
        ...state,
        saving: false,
        current: updated,
        items: state.items.map((u) => (u.id === updated.id ? updated : u)),
      };
    }

    case UPDATE_USER_FAILURE:
      return { ...state, saving: false, error: action.payload };

    // Delete
    case DELETE_USER_REQUEST:
      return { ...state, saving: true };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        saving: false,
        items: state.items.filter((u) => u.id !== action.payload),
        current: state.current?.id === action.payload ? null : state.current,
      };

    case DELETE_USER_FAILURE:
      return { ...state, saving: false, error: action.payload };

    default:
      return state;
  }
}