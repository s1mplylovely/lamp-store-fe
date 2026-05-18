import { apiFetch, API } from '../api';
import { clearCart } from './cartActions';

export const FETCH_ORDERS_REQUEST = 'orders/FETCH_ALL_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'orders/FETCH_ALL_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'orders/FETCH_ALL_FAILURE';

export const FETCH_MY_ORDERS_REQUEST = 'orders/FETCH_MY_REQUEST';
export const FETCH_MY_ORDERS_SUCCESS = 'orders/FETCH_MY_SUCCESS';
export const FETCH_MY_ORDERS_FAILURE = 'orders/FETCH_MY_FAILURE';

export const FETCH_ORDER_REQUEST = 'orders/FETCH_ONE_REQUEST';
export const FETCH_ORDER_SUCCESS = 'orders/FETCH_ONE_SUCCESS';
export const FETCH_ORDER_FAILURE = 'orders/FETCH_ONE_FAILURE';

export const CREATE_ORDER_REQUEST = 'orders/CREATE_REQUEST';
export const CREATE_ORDER_SUCCESS = 'orders/CREATE_SUCCESS';
export const CREATE_ORDER_FAILURE = 'orders/CREATE_FAILURE';

export const UPDATE_ORDER_REQUEST = 'orders/UPDATE_REQUEST';
export const UPDATE_ORDER_SUCCESS = 'orders/UPDATE_SUCCESS';
export const UPDATE_ORDER_FAILURE = 'orders/UPDATE_FAILURE';

export const DELETE_ORDER_REQUEST = 'orders/DELETE_REQUEST';
export const DELETE_ORDER_SUCCESS = 'orders/DELETE_SUCCESS';
export const DELETE_ORDER_FAILURE = 'orders/DELETE_FAILURE';

export const PAY_ORDER_REQUEST = 'orders/PAY_REQUEST';
export const PAY_ORDER_SUCCESS = 'orders/PAY_SUCCESS';
export const PAY_ORDER_FAILURE = 'orders/PAY_FAILURE';

export const FETCH_STATISTICS_REQUEST = 'orders/FETCH_STATISTICS_REQUEST';
export const FETCH_STATISTICS_SUCCESS = 'orders/FETCH_STATISTICS_SUCCESS';
export const FETCH_STATISTICS_FAILURE = 'orders/FETCH_STATISTICS_FAILURE';


function buildQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) qs.set(key, val);
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

// GET /orders/   (админ)
export const fetchOrders = (filters = {}) => async (dispatch) => {
  dispatch({ type: FETCH_ORDERS_REQUEST });
  try {
    const query = buildQuery({
      status: filters.status,
      payment_method: filters.payment_method,
      date_from: filters.date_from,
      date_to: filters.date_to,
      search: filters.search,
      skip: filters.skip,
      limit: filters.limit,
    });
    const data = await apiFetch(API, `/orders/${query}`);
    dispatch({ type: FETCH_ORDERS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_ORDERS_FAILURE, payload: err.message });
  }
};

// GET /orders/my
export const fetchMyOrders = () => async (dispatch) => {
  dispatch({ type: FETCH_MY_ORDERS_REQUEST });
  try {
    const data = await apiFetch(API, '/orders/my');
    dispatch({ type: FETCH_MY_ORDERS_SUCCESS, payload: Array.isArray(data) ? data : data.orders ?? [] });
  } catch (err) {
    dispatch({ type: FETCH_MY_ORDERS_FAILURE, payload: err.message });
  }
};

// GET /orders/{order_id}
export const fetchOrder = (id) => async (dispatch) => {
  dispatch({ type: FETCH_ORDER_REQUEST });
  try {
    const data = await apiFetch(API, `/orders/${id}`);
    dispatch({ type: FETCH_ORDER_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_ORDER_FAILURE, payload: err.message });
  }
};

// POST /orders/
export const createOrder = (payload) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });
  try {
    const order = await apiFetch(API, '/orders/', {
      method: 'POST',
      body: JSON.stringify({
        address: payload.address,
        payment_method: payload.payment_method === 'card' ? 'карта' : 'наличные',
        comment: payload.comment ?? null,
      }),
    });

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: order });
    dispatch(clearCart());
    return { ...order, id: order.uuid };
  } catch (err) {
    dispatch({ type: CREATE_ORDER_FAILURE, payload: err.message });
    return null;
  }
};

// PATCH /orders/{order_id}
export const updateOrder = (id, updates) => async (dispatch) => {
  dispatch({ type: UPDATE_ORDER_REQUEST });
  try {
    const data = await apiFetch(API, `/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: UPDATE_ORDER_FAILURE, payload: err.message });
    return null;
  }
};

// DELETE /orders/{order_id}
export const deleteOrder = (id) => async (dispatch) => {
  dispatch({ type: DELETE_ORDER_REQUEST });
  try {
    await apiFetch(API, `/orders/${id}`, { method: 'DELETE' });
    dispatch({ type: DELETE_ORDER_SUCCESS, payload: id });
    return true;
  } catch (err) {
    dispatch({ type: DELETE_ORDER_FAILURE, payload: err.message });
    return false;
  }
};

// POST /payments/
export const payOrder = (orderId, amount = 0) => async (dispatch) => {
  dispatch({ type: PAY_ORDER_REQUEST });
  try {
    await apiFetch(API, '/payments/', {
      method: 'POST',
      body: JSON.stringify({
        order_id: orderId,
        transaction_id: `txn_${Date.now()}`,
        provider: 'stripe',
        amount,
      }),
    });
    dispatch({ type: PAY_ORDER_SUCCESS });
    return true;
  } catch (err) {
    dispatch({ type: PAY_ORDER_FAILURE, payload: err.message });
    return false;
  }
};

// GET /order-items/order/{order_id}
export const fetchOrderItems = (orderId) => async (dispatch, getState) => {
  try {
    const data = await apiFetch(API, `/order-items/order/${orderId}`);
    const raw = Array.isArray(data) ? data : (data?.order_items ?? []);
    const products = getState().products?.items ?? [];
    const items = raw.map((i) => {
      const product = products.find((p) => p.id === i.product_id);
      return {
        id: i.uuid,
        productId: i.product_id,
        name: product?.name ?? i.product_id,
        qty: i.quantity,
        price: i.price_snapshot,
      };
    });
    dispatch({ type: ORDER_ITEMS_LOADED, payload: { orderId, items } });
  } catch (err) {
    console.error('fetchOrderItems error:', err.message);
  }
};

export const ORDER_ITEMS_LOADED = 'orders/ITEMS_LOADED';
// PATCH /orders/{order_id}/status
export const patchOrderStatus = (id, status) => async (dispatch) => {
  dispatch({ type: UPDATE_ORDER_REQUEST });
  try {
    const data = await apiFetch(API, `/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: UPDATE_ORDER_FAILURE, payload: err.message });
    return null;
  }
};

// GET /orders/statistics (админ)
export const fetchStatistics = () => async (dispatch) => {
  dispatch({ type: FETCH_STATISTICS_REQUEST });
  try {
    const data = await apiFetch(API, '/orders/statistics');
    dispatch({ type: FETCH_STATISTICS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_STATISTICS_FAILURE, payload: err.message });
  }
};