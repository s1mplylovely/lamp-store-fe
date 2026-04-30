import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  const openAuthModal = (message = 'Авторизуйтесь, чтобы начать покупки') => {
    setAuthModalMessage(message);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
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
