import { createContext, useContext, useState } from 'react';
import { PRODUCTS, USERS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(PRODUCTS);

  const login = (login) => {
    const user = USERS.find((u) => u.email === login || u.phone === login);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const loginAsCustomer = () => {
    setCurrentUser(USERS[1]);
  };

  const loginAsAdmin = () => {
    setCurrentUser(USERS[0]);
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const openAuthModal = (message = 'Авторизуйтесь, чтобы начать покупки') => {
    setAuthModalMessage(message);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const addToCart = (product, qty = 1) => {
    if (!currentUser) {
      openAuthModal('Авторизуйтесь, чтобы добавить товары в корзину');
      return false;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty }];
    });
    return true;
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
  };

  const updateProduct = (productId, data) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...data } : p))
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        loginAsCustomer,
        loginAsAdmin,
        logout,
        cart,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        authModalOpen,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}