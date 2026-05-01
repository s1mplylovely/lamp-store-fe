import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Box, Typography, Paper, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, RadioGroup,
  FormControlLabel, Radio, FormLabel, Divider, IconButton, Table,
  TableHead, TableBody, TableRow, TableCell,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import QuantitySelector from '../../components/ui/QuantitySelector/QuantitySelector';
import { useApp } from '../../context/AppContext';
import { ORDER_STATUSES } from '../../data/mockData';
import DeleteProductDialog from '../../components/ui/DeleteDialog';
import styles from './OrderEditPage.module.css';

export default function OrderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrder, currentUser } = useApp();
  const [deleteIdx, setDeleteIdx] = useState(null);

  const order = orders.find((o) => o.id === id);

  const [form, setForm] = useState(order ? {
    clientName: order.clientName,
    clientPhone: order.clientPhone,
    clientEmail: order.clientEmail,
    address: order.address,
    paymentMethod: order.paymentMethod,
    status: order.status,
    items: [...order.items],
  } : null);

  if (!currentUser?.isAdmin || !order || !form) {
    return (
      <Container sx={{ pt: 4 }}>
        <Typography>Заказ не найден</Typography>
        <Button component={Link} to="/admin/orders">Вернуться</Button>
      </Container>
    );
  }

  const set = (f, v) => setForm((prev) => ({ ...prev, [f]: v }));

  const handleQty = (idx, qty) => {
    if (qty <= 0) {
      setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
    } else {
      setForm((f) => ({
        ...f,
        items: f.items.map((item, i) => i === idx ? { ...item, qty } : item),
      }));
    }
  };

  const handleRemoveItem = (idx) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const total = form.items.reduce((s, i) => s + i.price * i.qty, 0);

  const handleSave = () => {
    updateOrder(id, { ...form, total });
    navigate('/admin/orders');
  };

  const confirmRemoveItem = () => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, i) => i !== deleteIdx),
    }));
    setDeleteIdx(null);
  };

  return (
    <Container maxWidth="md" className={styles.root}>
      <Button
        component={Link}
        to="/admin/orders"
        startIcon={<ArrowBackIcon />}
        className={styles.backBtn}
      >
        Вернуться к заказам
      </Button>

      <Typography variant="h5" className={styles.heading}>
        Редактирование заказа {id}
      </Typography>

      <Paper className={styles.paper} elevation={1}>
        <Typography variant="h6" className={styles.sectionTitle}>Контактные данные</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Имя клиента" fullWidth value={form.clientName} onChange={(e) => set('clientName', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Телефон" fullWidth value={form.clientPhone} onChange={(e) => set('clientPhone', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="E-mail" fullWidth value={form.clientEmail} onChange={(e) => set('clientEmail', e.target.value)} />
          </Grid>
          <TextField label="Адрес доставки" fullWidth value={form.address} onChange={(e) => set('address', e.target.value)} />
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormLabel>Способ оплаты</FormLabel>
            <RadioGroup value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)}>
              <FormControlLabel value="card" control={<Radio />} label="Банковская карта" />
              <FormControlLabel value="cash" control={<Radio />} label="Наличные" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
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
                <TableCell align="right">{item.price} ₽</TableCell>
                <TableCell align="center">
                  <QuantitySelector
                    value={item.qty}
                    onIncrement={() => handleQty(idx, item.qty + 1)}
                    onDecrement={() => handleQty(idx, item.qty - 1)}
                  />
                </TableCell>
                <TableCell align="right">{(item.price * item.qty).toLocaleString('ru')} ₽</TableCell>
                <TableCell>
                  <IconButton size="small" color="error" onClick={() => setDeleteIdx(idx)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box className={styles.totalRow}>
          <Typography variant="h6">Итого: {total.toLocaleString('ru')} ₽</Typography>
        </Box>

        <Box className={styles.buttons}>
          <Button variant="outlined" component={Link} to="/admin/orders">Отмена</Button>
          <Button variant="contained" startIcon={<SaveIcon />} className={styles.saveBtn} onClick={handleSave}>
            Сохранить
          </Button>
        </Box>
      </Paper>
      <DeleteProductDialog
        open={deleteIdx !== null}
        onClose={() => setDeleteIdx(null)}
        onConfirm={confirmRemoveItem}
        entity="товар"
      />
    </Container>
  );
}
