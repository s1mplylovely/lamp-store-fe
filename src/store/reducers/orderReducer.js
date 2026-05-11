import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_MY_ORDERS_REQUEST,
  FETCH_MY_ORDERS_SUCCESS,
  FETCH_MY_ORDERS_FAILURE,
  FETCH_ORDER_REQUEST,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
  PAY_ORDER_REQUEST,
  PAY_ORDER_SUCCESS,
  PAY_ORDER_FAILURE,
  ORDER_ITEMS_LOADED,
} from '../actions/orderActions';

const initialState = {
  items: [],
  myOrders: [],
  current: null,
  total: 0,
  loading: false,
  saving: false,
  error: null,
  payStatus: null,  // null | 'success' | 'error'
  payError: null,
};

export function mapOrder(o) {
  if (!o) return null;
  return {
    id: o.uuid,
    uuid: o.uuid,
    userId: o.user_id,
    status: o.status,
    address: o.address ?? '',
    paymentMethod: o.payment_method,
    comment: o.comment ?? '',
    total: o.total_cost ?? 0,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    items: o.items ?? [],
    clientName: o.client_name ?? '',
    date: o.created_at ? new Date(o.created_at).toLocaleDateString('ru') : '',
  };
}

export default function orderReducer(state = initialState, action) {
  switch (action.type) {
    // Список для админа
    case FETCH_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.orders.map(mapOrder),
        total: action.payload.total ?? 0,
      };

    case FETCH_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Заказы клиента
    case FETCH_MY_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_MY_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        myOrders: action.payload.map(mapOrder),
      };

    case FETCH_MY_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Один заказ
    case FETCH_ORDER_REQUEST:
      return { ...state, loading: true, current: null, error: null };

    case FETCH_ORDER_SUCCESS:
      return { ...state, loading: false, current: mapOrder(action.payload) };

    case FETCH_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Create
    case CREATE_ORDER_REQUEST:
      return { ...state, saving: true, error: null };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        saving: false,
        current: mapOrder(action.payload),
        myOrders: [mapOrder(action.payload), ...state.myOrders],
      };

    case CREATE_ORDER_FAILURE:
      return { ...state, saving: false, error: action.payload };

    // Update
    case UPDATE_ORDER_REQUEST:
      return { ...state, saving: true, error: null };

    case UPDATE_ORDER_SUCCESS: {
      const updated = mapOrder(action.payload);
      return {
        ...state,
        saving: false,
        current: updated,
        items: state.items.map((o) => (o.id === updated.id ? updated : o)),
        myOrders: state.myOrders.map((o) => (o.id === updated.id ? updated : o)),
      };
    }

    case UPDATE_ORDER_FAILURE:
      return { ...state, saving: false, error: action.payload };

    // Delete
    case DELETE_ORDER_REQUEST:
      return { ...state, saving: true };

    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        saving: false,
        items: state.items.filter((o) => o.id !== action.payload),
        myOrders: state.myOrders.filter((o) => o.id !== action.payload),
      };

    case DELETE_ORDER_FAILURE:
      return { ...state, saving: false, error: action.payload };

    // Payment
    case PAY_ORDER_REQUEST:
      return { ...state, saving: true, payStatus: null, payError: null };

    case PAY_ORDER_SUCCESS:
      return { ...state, saving: false, payStatus: 'success' };

    case PAY_ORDER_FAILURE:
      return { ...state, saving: false, payStatus: 'error', payError: action.payload };

    case ORDER_ITEMS_LOADED: {
      const { orderId, items } = action.payload;
      const patch = (list) => list.map((o) => o.id === orderId ? { ...o, items } : o);
      return {
        ...state,
        items: patch(state.items),
        myOrders: patch(state.myOrders),
        current: state.current?.id === orderId ? { ...state.current, items } : state.current,
      };
    }

    default:
      return state;
  }
}