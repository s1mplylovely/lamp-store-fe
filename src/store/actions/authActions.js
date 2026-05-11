import { apiFetch, USER_API } from '../api';

// ── Action type constants ─────────────────────────────────────────────────────
export const SIGNUP_REQUEST = 'auth/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'auth/SIGNUP_FAILURE';

export const VERIFY_CODE_REQUEST = 'auth/VERIFY_CODE_REQUEST';
export const VERIFY_CODE_SUCCESS = 'auth/VERIFY_CODE_SUCCESS';
export const VERIFY_CODE_FAILURE = 'auth/VERIFY_CODE_FAILURE';

export const FETCH_ME_REQUEST = 'auth/FETCH_ME_REQUEST';
export const FETCH_ME_SUCCESS = 'auth/FETCH_ME_SUCCESS';
export const FETCH_ME_FAILURE = 'auth/FETCH_ME_FAILURE';

export const LOGOUT = 'auth/LOGOUT';

// POST /auth/signup    /auth/signin
export const signup = ({ email, phone }) => async (dispatch) => {
  dispatch({ type: SIGNUP_REQUEST });
  try {
    const data = await apiFetch(USER_API, '/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email: email || null, phone: phone || null }),
    });
    dispatch({ type: SIGNUP_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: SIGNUP_FAILURE, payload: err.message });
    return null;
  }
};

// POST /auth/verify-code
export const verifyCode = (firstArg, secondArg) => async (dispatch, getState) => {
  let uuid, role, code;
  if (typeof firstArg === 'object') {
    ({ uuid, role, code } = firstArg);
  } else {
    code = secondArg;
    uuid = getState().auth.signupUuid;
    role = getState().auth.signupRole ?? 'client';
  }

  dispatch({ type: VERIFY_CODE_REQUEST });
  try {
    const data = await apiFetch(USER_API, '/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ uuid, role, code }),
    });
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    dispatch({ type: VERIFY_CODE_SUCCESS, payload: data });
    dispatch(fetchMe());
    return data;
  } catch (err) {
    dispatch({ type: VERIFY_CODE_FAILURE, payload: err.message });
    return null;
  }
};

// GET /users/me
export const fetchMe = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  dispatch({ type: FETCH_ME_REQUEST });
  try {
    const data = await apiFetch(USER_API, '/users/me');
    dispatch({ type: FETCH_ME_SUCCESS, payload: data });
    return data;
  } catch {
    localStorage.removeItem('token');
    dispatch({ type: FETCH_ME_FAILURE });
    return null;
  }
};

// POST /auth/signin
export const requestCode = (contact, type) => async (dispatch) => {
  dispatch({ type: SIGNUP_REQUEST });
  try {
    const body = type === 'email'
      ? { email: contact, phone: null }
      : { email: null, phone: contact };

    const data = await apiFetch(USER_API, '/auth/signin', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    dispatch({ type: SIGNUP_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: SIGNUP_FAILURE, payload: err.message });
    return null;
  }
};

// PATCH /users/{id}
export const updateProfile = (form) => async (dispatch, getState) => {
  dispatch({ type: FETCH_ME_REQUEST });
  try {
    const me = getState().auth.currentUser;
    if (!me) throw new Error('Not authenticated');

    const data = await apiFetch(USER_API, `/users/${me.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: form.name || null,
        email: form.email || null,
        phone: form.phone || null,
      }),
    });
    dispatch({ type: FETCH_ME_SUCCESS, payload: data });
    return data;
  } catch (err) {
    dispatch({ type: FETCH_ME_FAILURE, payload: err.message });
    return null;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: LOGOUT });
};