import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
} from '../actions/productActions';

const initialState = {
  items: [], // GET /products/
  total: 0,
  current: null, // один товар
  loading: false,
  saving: false,
  error: null,
};

export function mapProduct(p) {
  if (!p) return null;
  return {
    id: p.uuid,
    uuid: p.uuid,
    article: p.article,
    name: p.name,
    price: p.price,
    stock: p.quantity,
    category: p.category ?? null,
    base: p.base_type ?? null,
    color: p.color ?? null,
    colorTemp: p.color_temperature ?? null,
    power: p.power ?? null,
    voltage: p.voltage ?? null,
    flux: p.luminous_flux ?? null,
    lifespan: p.service_life ?? null,
    weight: p.weight ?? null,
    length: p.length ?? null,
    width: p.width ?? null,
    height: p.height ?? null,
    description: p.description ?? '',
    visible: p.is_visible,
    image: p.image_url ?? null,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    // Список товаров
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.products.map(mapProduct),
        total: action.payload.total ?? 0,
      };

    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Один товар
    case FETCH_PRODUCT_REQUEST:
      return { ...state, loading: true, current: null, error: null };

    case FETCH_PRODUCT_SUCCESS:
      return { ...state, loading: false, current: mapProduct(action.payload) };

    case FETCH_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Create
    case CREATE_PRODUCT_REQUEST:
      return { ...state, saving: true, error: null };

    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        saving: false,
        items: [mapProduct(action.payload), ...state.items],
      };

    case CREATE_PRODUCT_FAILURE:
      return { ...state, saving: false, error: action.payload };

    // Update
    case UPDATE_PRODUCT_REQUEST:
      return { ...state, saving: true, error: null };

    case UPDATE_PRODUCT_SUCCESS: {
      const updated = mapProduct(action.payload);
      return {
        ...state,
        saving: false,
        current: updated,
        items: state.items.map((p) => (p.id === updated.id ? updated : p)),
      };
    }

    case UPDATE_PRODUCT_FAILURE:
      return { ...state, saving: false, error: action.payload };

    // Delete
    case DELETE_PRODUCT_REQUEST:
      return { ...state, saving: true, error: null };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        saving: false,
        items: state.items.filter((p) => p.id !== action.payload),
        current: state.current?.id === action.payload ? null : state.current,
      };

    case DELETE_PRODUCT_FAILURE:
      return { ...state, saving: false, error: action.payload };

    default:
      return state;
  }
}