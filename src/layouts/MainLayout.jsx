import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import AuthModal from '../components/layout/AuthModal/AuthModal';
import { closeAuthModal } from '../store/actions/uiActions';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const dispatch = useDispatch();
  const authModalOpen = useSelector((s) => s.ui.authModal.open);
  const authModalMessage = useSelector((s) => s.ui.authModal.message);

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <AuthModal
        open={authModalOpen}
        message={authModalMessage}
        onClose={() => dispatch(closeAuthModal())}
      />
    </div>
  );
}