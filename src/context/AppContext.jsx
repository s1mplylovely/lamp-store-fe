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
        addToCart,
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