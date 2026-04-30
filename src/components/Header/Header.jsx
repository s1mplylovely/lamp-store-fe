import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Badge, Typography, Box, Button, Tooltip,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useApp } from '../../context/AppContext';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const { currentUser, cartCount, logout, openAuthModal } = useApp();

  const isAdmin = currentUser?.isAdmin;
  const isAuth = !!currentUser;

  const handleCartClick = () => {
    if (!isAuth) {
      openAuthModal('Авторизуйтесь, чтобы добавить товары в корзину');
    } else {
      navigate('/cart');
    }
  };

  const handleDashboardClick = () => {
    if (!isAuth) {
      openAuthModal('Авторизуйтесь, чтобы начать покупки');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AppBar position="sticky" className={styles.appBar} elevation={2}>
      <Toolbar className={styles.toolbar}>

        <Box className={styles.leftGroup}>
          {/* Логотип */}
          <Box className={styles.brand} component={Link} to="/catalog">
            <LightbulbIcon className={styles.logo} />
            <Typography variant="h6" className={styles.storeName}>
              ЗАВОД ЛАМПОЧЕК
            </Typography>
          </Box>

          {/* Каталог */}
          <Button
            color="inherit"
            startIcon={<MenuBookIcon />}
            component={Link}
            to="/catalog"
          >
            Каталог
          </Button>
        </Box>

        <Box className={styles.rightGroup}>
          {/* Админ nav */}
          {isAdmin && (
            <Box className={styles.adminNav}>
              <Button
                color="inherit"
                startIcon={<ListAltIcon />}
                component={Link}
                to="/admin/orders"
              >
                Заказы
              </Button>

              <Button
                color="inherit"
                startIcon={<PeopleIcon />}
                component={Link}
                to="/admin/users"
              >
                Клиенты
              </Button>
            </Box>
          )}

          {/* Корзина (скрыто для админа) */}
          {!isAdmin && (
            <Button
              color="inherit"
              onClick={handleCartClick}
              startIcon={
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              }
            >
              Корзина
            </Button>
          )}

          {/* ЛК */}
          <Button
            color="inherit"
            startIcon={<PersonIcon />}
            onClick={handleDashboardClick}
          >
            {isAuth ? 'Личный кабинет' : 'Войти'}
          </Button>

          {/* Выход */}
          {isAuth && (
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Выйти
            </Button>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}
