import { apiFetch, API } from '../api';

export const FETCH_CART_REQUEST = 'cart/FETCH_REQUEST';
export const FETCH_CART_SUCCESS = 'cart/FETCH_SUCCESS';
export const FETCH_CART_FAILURE = 'cart/FETCH_FAILURE';

export const ADD_TO_CART_REQUEST = 'cart/ADD_REQUEST';
export const ADD_TO_CART_SUCCESS = 'cart/ADD_SUCCESS';
export const ADD_TO_CART_FAILURE = 'cart/ADD_FAILURE';

export const UPDATE_CART_QTY_REQUEST = 'cart/UPDATE_QTY_REQUEST';
export const UPDATE_CART_QTY_SUCCESS = 'cart/UPDATE_QTY_SUCCESS';
export const UPDATE_CART_QTY_FAILURE = 'cart/UPDATE_QTY_FAILURE';

export const REMOVE_FROM_CART_REQUEST = 'cart/REMOVE_REQUEST';
export const REMOVE_FROM_CART_SUCCESS = 'cart/REMOVE_SUCCESS';
export const REMOVE_FROM_CART_FAILURE = 'cart/REMOVE_FAILURE';

export const CLEAR_CART_REQUEST = 'cart/CLEAR_REQUEST';
export const CLEAR_CART_SUCCESS = 'cart/CLEAR_SUCCESS';
export const CLEAR_CART_FAILURE = 'cart/CLEAR_FAILURE';


function mapCartItem(apiItem, products = []) {
  const product = products.find((p) => p.id === apiItem.product_id);
  return {
    cartItemId: apiItem.uuid,
    productId: apiItem.product_id,
    qty: apiItem.quantity,
    name: product?.name ?? apiItem.product_id,
    price: product?.price ?? 0,
  };
}

// GET /cart/
export const fetchCart = (products = []) => async (dispatch) => {
  dispatch({ type: FETCH_CART_REQUEST });
  try {
    const data = await apiFetch(API, '/cart/');
    const items = (data?.cart_items ?? []).map((i) => mapCartItem(i, products));
    dispatch({ type: FETCH_CART_SUCCESS, payload: items });
  } catch (err) {
    dispatch({ type: FETCH_CART_FAILURE, payload: err.message });
  }
};

// POST /cart/
export const addToCart = (product) => async (dispatch) => {
  dispatch({ type: ADD_TO_CART_REQUEST });
  try {
    const data = await apiFetch(API, '/cart/', {
      method: 'POST',
      body: JSON.stringify({ product_id: product.id, quantity: 1 }),
    });
    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: {
        cartItemId: data.uuid,
        productId: data.product_id,
        qty: data.quantity,
        name: product.name,
        price: product.price,
      },
    });
    return data;
  } catch (err) {
    dispatch({ type: ADD_TO_CART_FAILURE, payload: err.message });
    return null;
  }
};

// PATCH /cart/{cart_item_id}
export const updateCartQty = (productId, qty) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_CART_QTY_REQUEST });
  try {
    const cartItem = getState().cart.items.find((i) => i.productId === productId);
    if (!cartItem) throw new Error('Cart item not found in state');

    if (qty <= 0) {
      return dispatch(removeFromCart(productId));
    }

    await apiFetch(API, `/cart/${cartItem.cartItemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity: qty }),
    });
    dispatch({ type: UPDATE_CART_QTY_SUCCESS, payload: { productId, qty } });
  } catch (err) {
    dispatch({ type: UPDATE_CART_QTY_FAILURE, payload: err.message });
  }
};

// DELETE /cart/{cart_item_id}
export const removeFromCart = (productId) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_FROM_CART_REQUEST });
  try {
    const cartItem = getState().cart.items.find((i) => i.productId === productId);
    if (!cartItem) throw new Error('Cart item not found in state');

    await apiFetch(API, `/cart/${cartItem.cartItemId}`, {
      method: 'DELETE',
    });
    dispatch({ type: REMOVE_FROM_CART_SUCCESS, payload: productId });
  } catch (err) {
    dispatch({ type: REMOVE_FROM_CART_FAILURE, payload: err.message });
  }
};

// DELETE /cart/clear
export const clearCart = () => async (dispatch) => {
  dispatch({ type: CLEAR_CART_REQUEST });
  try {
    await apiFetch(API, '/cart/clear', { method: 'DELETE' });
    dispatch({ type: CLEAR_CART_SUCCESS });
  } catch (err) {
    dispatch({ type: CLEAR_CART_FAILURE, payload: err.message });
  }
};