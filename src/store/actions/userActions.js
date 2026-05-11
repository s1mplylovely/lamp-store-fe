import { apiFetch, USER_API } from '../api';

export const FETCH_USERS_REQUEST = 'users/FETCH_ALL_REQUEST';
export const FETCH_USERS_SUCCESS = 'users/FETCH_ALL_SUCCESS';
export const FETCH_USERS_FAILURE = 'users/FETCH_ALL_FAILURE';

export const FETCH_USER_REQUEST = 'users/FETCH_ONE_REQUEST';
export const FETCH_USER_SUCCESS = 'users/FETCH_ONE_SUCCESS';
export const FETCH_USER_FAILURE = 'users/FETCH_ONE_FAILURE';

export const CREATE_USER_REQUEST = 'users/CREATE_REQUEST';
export const CREATE_USER_SUCCESS = 'users/CREATE_SUCCESS';
export const CREATE_USER_FAILURE = 'users/CREATE_FAILURE';

export const UPDATE_USER_REQUEST = 'users/UPDATE_REQUEST';
export const UPDATE_USER_SUCCESS = 'users/UPDATE_SUCCESS';
export const UPDATE_USER_FAILURE = 'users/UPDATE_FAILURE';

export const DELETE_USER_REQUEST = 'users/DELETE_REQUEST';
export const DELETE_USER_SUCCESS = 'users/DELETE_SUCCESS';
export const DELETE_USER_FAILURE = 'users/DELETE_FAILURE';

function buildQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) qs.set(key, val);
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

// GET /users/
export const fetchUsers = (filters = {}) => async (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });
  try {
    const query = buildQuery({
      search: filters.search,
      skip: filters.skip,
      limit: filters.limit,
    });
    const data = await apiFetch(USER_API, `/users/${query}`);
    dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_USERS_FAILURE, payload: err.message });
  }
};

// GET /users/{user_id}
export const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: FETCH_USER_REQUEST });
  try {
    const data = await apiFetch(USER_API, `/users/${id}`);
    dispatch({ type: FETCH_USER_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: FETCH_USER_FAILURE, payload: err.message });
    return null;
  }
};

// POST /users/
export const createUser = (form) => async (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });
  try {
    const data = await apiFetch(USER_API, '/users/', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name || null,
        email: form.email || null,
        phone: form.phone || null,
        role: form.isAdmin ? 'admin' : 'client',
        is_blocked: form.isBlocked ?? false,
      }),
    });
    dispatch({ type: CREATE_USER_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: CREATE_USER_FAILURE, payload: err.message });
    return null;
  }
};

// PATCH /users/{user_id}
export const updateUser = (id, form) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const body = {};
    if (form.name !== undefined) body.name = form.name || null;
    if (form.email !== undefined) body.email = form.email || null;
    if (form.phone !== undefined) body.phone = form.phone || null;
    if (form.isAdmin !== undefined) body.role = form.isAdmin ? 'admin' : 'client';
    if (form.isBlocked !== undefined) body.is_blocked = form.isBlocked;

    const data = await apiFetch(USER_API, `/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: UPDATE_USER_FAILURE, payload: err.message });
    return null;
  }
};

// DELETE /users/{user_id}
export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    await apiFetch(USER_API, `/users/${id}`, { method: 'DELETE' });
    dispatch({ type: DELETE_USER_SUCCESS, payload: id });
    return true;
  } catch (err) {
    dispatch({ type: DELETE_USER_FAILURE, payload: err.message });
    return false;
  }
};