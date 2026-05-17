import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Box, Typography, Paper, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, RadioGroup,
  FormControlLabel, Radio, FormLabel, Divider, IconButton, Table,
  TableHead, TableBody, TableRow, TableCell, CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import QuantitySelector from '../../components/ui/QuantitySelector/QuantitySelector';
import { fetchOrder, updateOrder, fetchOrderItems } from '../../store/actions/orderActions';
import { fetchUser } from '../../store/actions/userActions';
import { ORDER_STATUSES } from '../../data/common';
import styles from './OrderEditPage.module.css';

export default function OrderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const { current: order, loading, saving } = useSelector((s) => s.orders);
  const users = useSelector((s) => s.users.items);

  const [form, setForm] = useState(null);
  const [client, setClient] = useState({ name: '', phone: '', email: '' });

  // Загружаем заказ
  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [dispatch, id]);

  // Загружаем items и пользователя
  useEffect(() => {
    if (!order || order.id !== id) return;
    dispatch(fetchOrderItems(id));
    const existingUser = users.find((u) => u.id === order.userId);
    if (existingUser) {
      setClient({ name: existingUser.name, phone: existingUser.phone, email: existingUser.email });
    } else if (order.userId) {
      dispatch(fetchUser(order.userId)).then((u) => {
        if (u) setClient({ name: u.name ?? '', phone: u.phone ?? '', email: u.email ?? '' });
      });
    }
  }, [order?.id]);

  useEffect(() => {
    if (!order || order.id !== id) return;
    setForm({
      address: order.address ?? '',
      paymentMethod: order.paymentMethod ?? 'наличные',
      status: order.status ?? 'новый',
      items: order.items ? [...order.items] : [],
    });
  }, [order?.id, order?.items?.length]);

  if (!currentUser?.isAdmin) return <Container><Typography>Нет доступа</Typography></Container>;
  if (loading || !form) return (
    <Container sx={{ pt: 6, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );

  const set = (f, v) => setForm((prev) => ({ ...prev, [f]: v }));

  const handleQty = (idx, qty) => {
    if (qty <= 0) {
      setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
    } else {
      setForm((f) => ({ ...f, items: f.items.map((item, i) => i === idx ? { ...item, qty } : item) }));
    }
  };

  const handleRemoveItem = (idx) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const total = form.items.reduce((s, i) => s + (i.price ?? 0) * (i.qty ?? 0), 0);

  const handleSave = async () => {
    await dispatch(updateOrder(id, {
      address: form.address,
      payment_method: form.paymentMethod,
      status: form.status,
    }));
    navigate('/admin/orders');
  };

  return (
    <Container maxWidth="md" className={styles.root}>
      <Button component={Link} to="/admin/orders" startIcon={<ArrowBackIcon />} className={styles.backBtn}>
        Вернуться к заказам
      </Button>

      <Typography variant="h5" className={styles.heading}>
        Редактирование заказа {id.slice(0, 8)}…
      </Typography>

      <Paper className={styles.paper} elevation={1}>
        {/* Контактные данные */}
        <Typography variant="h6" className={styles.sectionTitle}>Контактные данные</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6}>
            <TextField label="Имя клиента" fullWidth value={client.name} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField label="Телефон" fullWidth value={client.phone} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField label="E-mail" fullWidth value={client.email} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField label="Адрес доставки" fullWidth value={form.address}
              onChange={(e) => set('address', e.target.value)} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid xs={12} sm={6}>
            <FormLabel>Способ оплаты</FormLabel>
            <RadioGroup value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)}>
              <FormControlLabel value="карта" control={<Radio />} label="Банковская карта" />
              <FormControlLabel value="наличные" control={<Radio />} label="Наличные" />
            </RadioGroup>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select label="Статус" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {Object.entries(ORDER_STATUSES).map(([val, label]) => (
                  <MenuItem key={val} value={val}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" className={styles.sectionTitle}>Состав заказа</Typography>
        {form.items.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box className={styles.tableWrapper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Товар</TableCell>
                  <TableCell align="right">Цена</TableCell>
                  <TableCell align="center">Кол-во</TableCell>
                  <TableCell align="right">Сумма</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {form.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.price?.toLocaleString('ru')} ₽</TableCell>
                    <TableCell align="center">
                      <QuantitySelector
                        value={item.qty}
                        onIncrement={() => handleQty(idx, item.qty + 1)}
                        onDecrement={() => handleQty(idx, item.qty - 1)}
                      />
                    </TableCell>
                    <TableCell align="right">{((item.price ?? 0) * item.qty).toLocaleString('ru')} ₽</TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        <Box className={styles.totalRow}>
          <Typography variant="h6">Итого: {total.toLocaleString('ru')} ₽</Typography>
        </Box>

        <Box className={styles.buttons}>
          <Button variant="outlined" component={Link} to="/admin/orders">Отмена</Button>
          <Button variant="contained" startIcon={<SaveIcon />} className={styles.saveBtn}
            onClick={handleSave} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}