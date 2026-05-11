import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/actions/authActions';
import { fetchCart } from './store/actions/cartActions';
import { router } from './router/index';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a1a2e',
    },
    secondary: {
      main: '#f5c518',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    }
  },
});

function AppInner() {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  // Загружаем корзину с сервера как только появился авторизованный пользователь
  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) {
      dispatch(fetchCart());
    }
  }, [dispatch, currentUser?.id]);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppInner />
    </ThemeProvider>
  );
}