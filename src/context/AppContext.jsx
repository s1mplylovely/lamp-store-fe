import { createContext, useContext, useState } from 'react';
import { PRODUCTS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(PRODUCTS);

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

  return (
    <AppContext.Provider
      value={{
        currentUser,
        products,
        addToCart,
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