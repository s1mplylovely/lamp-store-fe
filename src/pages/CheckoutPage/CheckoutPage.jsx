import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Box, Typography, Paper, TextField, Button, Divider,
  RadioGroup, FormControlLabel, Radio, FormLabel, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApp } from '../../context/AppContext';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { currentUser, cart, cartTotal } = useApp();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: '',
    payment: 'card',
  });

  if (!currentUser || cart.length === 0) {
    navigate('/catalog');
    return null;
  }

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = () => {
    navigate('/checkout/confirm', { state: { form, cart, cartTotal } });
  };

  return (
    <Container maxWidth="md" className={styles.root}>
      <Button
        component={Link}
        to="/cart"
        startIcon={<ArrowBackIcon />}
        className={styles.backBtn}
      >
        Вернуться в корзину
      </Button>

      <Typography variant="h4" className={styles.heading}>Оформление заказа</Typography>

      <Grid container spacing={3}>
        {/* Форма */}
        <Grid item xs={12} md={7}>
          <Paper className={styles.paper} elevation={1}>
            <Typography variant="h6" className={styles.sectionTitle}>Контактные данные</Typography>
            <Box className={styles.fields}>
              <TextField label="Ваше имя" fullWidth value={form.name} disabled />
              <TextField label="Телефон" fullWidth value={form.phone} disabled />
              <TextField label="E-mail" fullWidth value={form.email} disabled />
              <TextField label="Адрес доставки" fullWidth multiline rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} />
            </Box>

            <Divider sx={{ my: 3 }} />
            <FormLabel component="legend">Способ оплаты</FormLabel>
            <RadioGroup value={form.payment} onChange={(e) => set('payment', e.target.value)}>
              <FormControlLabel value="card" control={<Radio />} label="Банковская карта" />
              <FormControlLabel value="cash" control={<Radio />} label="Наличными при получении" />
            </RadioGroup>
          </Paper>
        </Grid>

        {/* Заказ */}
        <Grid item xs={12} md={5}>
          <Paper className={styles.summary} elevation={1}>
            <Typography variant="h6" className={styles.sectionTitle}>Ваш заказ</Typography>
            {cart.map((item) => (
              <Box key={item.productId} className={styles.summaryRow}>
                <Box>
                  <Typography variant="body2" className={styles.itemName}>{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">× {item.qty}</Typography>
                </Box>
                <Typography variant="body2" className={styles.itemPrice}>
                  {(item.price * item.qty).toLocaleString('ru')} ₽
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box className={styles.totalRow}>
              <Typography variant="h6">Итого:</Typography>
              <Typography variant="h6" className={styles.totalAmount}>
                {cartTotal.toLocaleString('ru')} ₽
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              className={styles.payBtn}
              onClick={handleSubmit}
              disabled={!form.address}
            >
              {form.payment === "card" ? "Оплатить заказ" : "Оформить заказ"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
