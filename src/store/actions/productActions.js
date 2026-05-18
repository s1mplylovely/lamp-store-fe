import { apiFetch, API } from '../api';

export const FETCH_PRODUCTS_REQUEST = 'products/FETCH_ALL_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'products/FETCH_ALL_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'products/FETCH_ALL_FAILURE';

export const FETCH_PRODUCT_REQUEST = 'products/FETCH_ONE_REQUEST';
export const FETCH_PRODUCT_SUCCESS = 'products/FETCH_ONE_SUCCESS';
export const FETCH_PRODUCT_FAILURE = 'products/FETCH_ONE_FAILURE';

export const CREATE_PRODUCT_REQUEST = 'products/CREATE_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'products/CREATE_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'products/CREATE_FAILURE';

export const UPDATE_PRODUCT_REQUEST = 'products/UPDATE_REQUEST';
export const UPDATE_PRODUCT_SUCCESS = 'products/UPDATE_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'products/UPDATE_FAILURE';

export const DELETE_PRODUCT_REQUEST = 'products/DELETE_REQUEST';
export const DELETE_PRODUCT_SUCCESS = 'products/DELETE_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'products/DELETE_FAILURE';

function toApiBody(form) {
  return {
    name: form.name,
    article: form.article,
    price: Number(form.price),
    quantity: Number(form.stock),
    is_visible: form.visible ?? true,
    description: form.description || null,
    image_url: form.image || null,
    category: form.category || null,
    base_type: form.base || null,
    color: form.color || null,
    color_temperature: form.colorTemp ? Number(form.colorTemp) : null,
    power: form.power ? Number(form.power) : null,
    voltage: form.voltage ? Number(form.voltage) : null,
    luminous_flux: form.flux ? Number(form.flux) : null,
    service_life: form.lifespan ? Number(form.lifespan) : null,
    weight: form.weight ? Number(form.weight) : null,
    height: form.height ? Number(form.height) : null,
    width: form.width ? Number(form.width) : null,
    length: form.length ? Number(form.length) : null,
  };
}

// query string из фильтра
function buildQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    if (Array.isArray(val)) {
      val.forEach((v) => qs.append(key, v));
    } else {
      qs.set(key, val);
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

// GET /products
export const fetchProducts = (filters = {}) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  try {
    const query = buildQuery({
      min_price: filters.price_min,
      max_price: filters.price_max,
      in_stock: filters.visible !== undefined ? filters.visible : undefined,
      category: filters.category,
      base_type: filters.base,
      color: filters.color,
      search: filters.search,
      skip: filters.skip,
      limit: filters.limit,
    });
    const data = await apiFetch(API, `/products/${query}`);
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: err.message });
  }
};

// GET /products/{product_id}
export const fetchProduct = (id) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCT_REQUEST });
  try {
    const data = await apiFetch(API, `/products/${id}`);
    dispatch({ type: FETCH_PRODUCT_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_PRODUCT_FAILURE, payload: err.message });
  }
};

// POST /products
export const createProduct = (form) => async (dispatch) => {
  dispatch({ type: CREATE_PRODUCT_REQUEST });
  try {
    const data = await apiFetch(API, '/products/', {
      method: 'POST',
      body: JSON.stringify(toApiBody(form)),
    });
    dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: CREATE_PRODUCT_FAILURE, payload: err.message });
    return null;
  }
};

// PATCH /products/{product_id}
export const updateProduct = (id, form) => async (dispatch) => {
  dispatch({ type: UPDATE_PRODUCT_REQUEST });
  try {
    const data = await apiFetch(API, `/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toApiBody(form)),
    });
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: UPDATE_PRODUCT_FAILURE, payload: err.message });
    return null;
  }
};

// PATCH /products/{product_id}  — видимость на витрине
export const patchProductVisibility = (id, isVisible) => async (dispatch) => {
  dispatch({ type: UPDATE_PRODUCT_REQUEST });
  try {
    const data = await apiFetch(API, `/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_visible: isVisible }),
    });
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: UPDATE_PRODUCT_FAILURE, payload: err.message });
    return null;
  }
};

// DELETE /products/{product_id}
export const deleteProduct = (id) => async (dispatch) => {
  dispatch({ type: DELETE_PRODUCT_REQUEST });
  try {
    await apiFetch(API, `/products/${id}`, { method: 'DELETE' });
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: id });
    return true;
  } catch (err) {
    dispatch({ type: DELETE_PRODUCT_FAILURE, payload: err.message });
    return false;
  }
};