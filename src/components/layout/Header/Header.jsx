import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar, Toolbar, IconButton, Badge, Typography, Box, Button, Divider,
  Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { logout } from '../../../store/actions/authActions';
import { openAuthModal } from '../../../store/actions/uiActions';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentUser = useSelector((s) => s.auth.currentUser);
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));

  const isAdmin = currentUser?.isAdmin;
  const isAuth = !!currentUser;

  const handleCartClick = () => {
    setDrawerOpen(false);
    if (!isAuth) {
      dispatch(openAuthModal('Авторизуйтесь, чтобы добавить товары в корзину'));
    } else {
      navigate('/cart');
    }
  };

  const handleDashboardClick = () => {
    setDrawerOpen(false);
    if (!isAuth) {
      dispatch(openAuthModal('Авторизуйтесь, чтобы начать покупки'));
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    dispatch(logout());
  };

  const mobileDrawer = (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Box className={styles.drawerHeader}>
        <IconButton onClick={() => setDrawerOpen(false)} className={styles.icon}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider className={styles.divider} />

      <List className={styles.drawerList}>
        <ListItem
          button
          component={Link}
          to="/catalog"
          onClick={() => setDrawerOpen(false)}
          className={styles.drawerItem}
        >
          <ListItemIcon><MenuBookIcon className={styles.icon} /></ListItemIcon>
          <ListItemText primary="Каталог" />
        </ListItem>

        {isAdmin && (
          <>
            <ListItem
              button
              component={Link}
              to="/admin/orders"
              onClick={() => setDrawerOpen(false)}
              className={styles.drawerItem}
            >
              <ListItemIcon><ListAltIcon className={styles.icon} /></ListItemIcon>
              <ListItemText primary="Заказы" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/admin/users"
              onClick={() => setDrawerOpen(false)}
              className={styles.drawerItem}
            >
              <ListItemIcon><PeopleIcon className={styles.icon} /></ListItemIcon>
              <ListItemText primary="Клиенты" />
            </ListItem>
          </>
        )}

        {!isAdmin && (
          <ListItem button onClick={handleCartClick} className={styles.drawerItem}>
            <ListItemIcon>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon className={styles.icon} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Корзина" />
          </ListItem>
        )}

        <ListItem button onClick={handleDashboardClick} className={styles.drawerItem}>
          <ListItemIcon><PersonIcon className={styles.icon} /></ListItemIcon>
          <ListItemText primary={'Личный кабинет'} />
        </ListItem>

        {isAuth && (
          <ListItem button onClick={handleLogout} className={styles.drawerItem}>
            <ListItemIcon><LogoutIcon className={styles.icon} /></ListItemIcon>
            <ListItemText primary="Выйти" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );

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
          {isMobile ? (<></>) : (<>
            {/* Каталог */}
            <Button
              color="inherit"
              startIcon={<MenuBookIcon />}
              component={Link}
              to="/catalog"
            >
              Каталог
            </Button>
          </>)}
        </Box>

        {isMobile ? (
          <>
            <Box sx={{ flex: 1 }} />
            {!isAdmin && (
              <IconButton color="inherit" onClick={handleCartClick}>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            {mobileDrawer}
          </>
        ) : (
          <>
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
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              )}
            </Box>
          </>)}
      </Toolbar>
    </AppBar>
  );
}
