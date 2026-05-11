import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Box, Typography, Paper, Button, Alert, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { createOrder, payOrder } from '../../store/actions/orderActions';
import styles from './OrderConfirmationPage.module.css';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const { saving, payStatus } = useSelector((s) => s.orders);

  const [createdOrderId, setCreatedOrderId] = useState(null);

  const state = location.state;

  if (!currentUser || !state) {
    navigate('/catalog');
    return null;
  }

  const { form, cart, cartTotal } = state;
  const isCash = form.payment === 'cash';

  const handleConfirm = async () => {
    const orderPayload = {
      address: form.address,
      payment_method: form.payment,
      comment: null,
      items: cart.map((i) => ({
        product_id: i.productId,
        quantity: i.qty,
        price_snapshot: i.price,
      })),
    };

    const order = await dispatch(createOrder(orderPayload));
    if (!order) return;

    setCreatedOrderId(order.id);

    if (!isCash) {
      await dispatch(payOrder(order.id, cartTotal));
    }
  };

  // Успех
  if (createdOrderId && (isCash || payStatus === 'success')) {
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
          <Button variant="contained" className={styles.dashBtn} onClick={() => navigate('/dashboard')}>
            В личный кабинет
          </Button>
        </Paper>
      </Container>
    );
  }

  // Ошибка оплаты
  if (payStatus === 'error') {
    return (
      <Container maxWidth="sm" className={styles.root}>
        <Paper className={styles.paper} elevation={2}>
          <ErrorIcon className={styles.errorIcon} />
          <Typography variant="h5" className={styles.statusTitle}>Ошибка при оплате заказа</Typography>
          <Alert severity="error" sx={{ mb: 3 }}>Не удалось провести оплату. Попробуйте ещё раз.</Alert>
          <Button variant="contained" color="error" onClick={() => navigate('/cart')}>
            Вернуться к корзине
          </Button>
        </Paper>
      </Container>
    );
  }

  // Экран подтверждения
  return (
    <Container maxWidth="sm" className={styles.root}>
      <Button component={Link} to="/checkout" startIcon={<ArrowBackIcon />} className={styles.backBtn}>
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
          disabled={saving}
          sx={{ mt: 3 }}
        >
          {saving ? 'Оформление...' : isCash ? 'Подтвердить' : 'Оплатить'}
        </Button>
      </Paper>
    </Container>
  );
}