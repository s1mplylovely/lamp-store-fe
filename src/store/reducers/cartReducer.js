import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_QTY_REQUEST,
  UPDATE_CART_QTY_SUCCESS,
  UPDATE_CART_QTY_FAILURE,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE,
} from '../actions/cartActions';

const initialState = {
  // item: { cartItemId, productId, name, price, qty }
  items: [],
  loading: false,
  error: null,
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    // Fetch cart
    case FETCH_CART_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_CART_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case FETCH_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Add to cart
    case ADD_TO_CART_REQUEST:
      return { ...state, loading: true };

    case ADD_TO_CART_SUCCESS: {
      const incoming = action.payload;
      const exists = state.items.find((i) => i.productId === incoming.productId);
      if (exists) {
        return {
          ...state,
          loading: false,
          items: state.items.map((i) =>
            i.productId === incoming.productId
              ? { ...i, qty: i.qty + incoming.qty, cartItemId: incoming.cartItemId }
              : i
          ),
        };
      }
      return { ...state, loading: false, items: [...state.items, incoming] };
    }

    case ADD_TO_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Update
    case UPDATE_CART_QTY_REQUEST:
      return { ...state };

    case UPDATE_CART_QTY_SUCCESS: {
      const { productId, qty } = action.payload;
      if (qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.productId !== productId) };
      }
      return {
        ...state,
        items: state.items.map((i) => (i.productId === productId ? { ...i, qty } : i)),
      };
    }

    case UPDATE_CART_QTY_FAILURE:
      return { ...state, error: action.payload };

    // Remove from cart
    case REMOVE_FROM_CART_REQUEST:
      return { ...state };

    case REMOVE_FROM_CART_SUCCESS:
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.payload),
      };

    case REMOVE_FROM_CART_FAILURE:
      return { ...state, error: action.payload };

    // Clear
    case CLEAR_CART_REQUEST:
      return { ...state, loading: true };

    case CLEAR_CART_SUCCESS:
      return { ...state, loading: false, items: [] };

    case CLEAR_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}