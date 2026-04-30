import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AuthModal from '../components/AuthModal/AuthModal';
import { useApp } from '../context/AppContext';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const { authModalOpen, authModalMessage, closeAuthModal } = useApp();

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <AuthModal open={authModalOpen} message={authModalMessage} onClose={closeAuthModal} />
    </div>
  );
}
