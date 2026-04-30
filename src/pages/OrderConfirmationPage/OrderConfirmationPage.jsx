import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container, Box, Typography, Paper, Button, Alert, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useApp } from '../../context/AppContext';
import styles from './OrderConfirmationPage.module.css';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, addOrder, clearCart } = useApp();
  const [status, setStatus] = useState('pending'); // pending | success | error

  const state = location.state;

  if (!currentUser || !state) {
    navigate('/catalog');
    return null;
  }

  const { form, cart, cartTotal } = state;
  const isCash = form.payment === 'cash';

  const handleConfirm = () => {
    // 80% success, 20% error
    const success = Math.random() > 0.2;
    if (success) {
      const newOrder = {
        id: `ORD-${String(Date.now()).slice(-4)}`,
        date: new Date().toISOString().slice(0, 10),
        userId: currentUser.id,
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone,
        address: form.address,
        paymentMethod: form.payment,
        status: 'new',
        items: cart.map((i) => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty })),
        total: cartTotal,
      };
      addOrder(newOrder);
      clearCart();
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <Container maxWidth="sm" className={styles.root}>
        <Paper className={styles.paper} elevation={2}>
          <CheckCircleIcon className={styles.successIcon} />
          <Typography variant="h5" className={styles.statusTitle}>
            {isCash ? 'Заказ успешно оформлен!' : 'Заказ успешно оплачен!'}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Мы свяжемся с вами для подтверждения доставки.
          </Typography>
          <Button
            variant="contained"
            className={styles.dashBtn}
            onClick={() => navigate('/dashboard')}
          >
            В личный кабинет
          </Button>
        </Paper>
      </Container>
    );
  }

  if (status === 'error') {
    return (
      <Container maxWidth="sm" className={styles.root}>
        <Paper className={styles.paper} elevation={2}>
          <ErrorIcon className={styles.errorIcon} />
          <Typography variant="h5" className={styles.statusTitle}>Ошибка при оплате заказа</Typography>
          <Alert severity="error" sx={{ mb: 3 }}>Недостаточно средств</Alert>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate('/cart')}
          >
            Вернуться к корзине
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className={styles.root}>
      <Button
        component={Link}
        to="/checkout"
        startIcon={<ArrowBackIcon />}
        className={styles.backBtn}
      >
        Назад к оформлению
      </Button>

      <Paper className={styles.paper} elevation={2}>
        <Typography variant="h5" className={styles.heading}>Подтверждение заказа</Typography>

        <Typography sx={{ mb: 2 }}>
          Вы собираетесь {isCash ? 'оформить' : 'оплатить'} заказ на сумму:
        </Typography>
        <Typography variant="h4" className={styles.total}>
          {cartTotal.toLocaleString('ru')} ₽
        </Typography>

        <Divider sx={{ my: 2 }} />

        {cart.map((item) => (
          <Box key={item.productId} className={styles.row}>
            <Typography variant="body2">{item.name} × {item.qty}</Typography>
            <Typography variant="body2">{(item.price * item.qty).toLocaleString('ru')} ₽</Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box className={styles.infoRow}>
          <Typography variant="body2" color="text.secondary">Оплата:</Typography>
          <Typography variant="body2">{isCash ? 'Наличными при получении' : 'Банковская карта'}</Typography>
        </Box>
        <Box className={styles.infoRow}>
          <Typography variant="body2" color="text.secondary">Адрес:</Typography>
          <Typography variant="body2">{form.address}</Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          className={styles.confirmBtn}
          onClick={handleConfirm}
          sx={{ mt: 3 }}
        >
          {isCash ? 'Подтвердить' : 'Оплатить'}
        </Button>
      </Paper>
    </Container>
  );
}
