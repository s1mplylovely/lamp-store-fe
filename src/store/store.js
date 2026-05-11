import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import productReducer from './reducers/productReducer';
import authReducer from './reducers/authReducer';
import cartReducer from './reducers/cartReducer';
import orderReducer from './reducers/orderReducer';
import userReducer from './reducers/userReducer';
import uiReducer from './reducers/uiReducer';

const rootReducer = combineReducers({
  products: productReducer,
  auth: authReducer,
  cart: cartReducer,
  orders: orderReducer,
  users: userReducer,
  ui: uiReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk),
);

export default store;