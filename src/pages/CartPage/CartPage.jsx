import { Box, Container, Typography, Paper, Button, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import QuantitySelector from '../../components/ui/QuantitySelector/QuantitySelector';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { removeFromCart, updateCartQty } from '../../store/actions/cartActions';
import styles from './CartPage.module.css';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const cart = useSelector((s) => s.cart.items);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (!currentUser) {
    navigate('/catalog');
    return null;
  }

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <EmptyState
          icon={<ShoppingCartIcon style={{ fontSize: 64 }} />}
          title="Корзина пуста"
          description="Добавьте товары из каталога"
          actionLabel="Перейти в каталог"
          onAction={() => navigate('/catalog')}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={styles.root}>
      <Typography variant="h4" className={styles.heading}>Корзина</Typography>

      <Box className={styles.layout}>
        <Paper className={styles.itemList} elevation={1}>
          {cart.map((item) => (
            <Box key={item.productId}>
              <Box className={styles.item}>
                <Box className={styles.itemInfo}>
                  <Typography variant="body1" className={styles.itemName}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.price} ₽ / шт.
                  </Typography>
                </Box>
                <Box className={styles.itemControls}>
                  <QuantitySelector
                    value={item.qty}
                    onIncrement={() => dispatch(updateCartQty(item.productId, item.qty + 1))}
                    onDecrement={() => dispatch(updateCartQty(item.productId, item.qty - 1))}
                  />
                  <Typography variant="body1" className={styles.itemTotal}>
                    {(item.price * item.qty).toLocaleString('ru')} ₽
                  </Typography>
                  <IconButton color="error" size="small" onClick={() => dispatch(removeFromCart(item.productId))}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
            </Box>
          ))}
        </Paper>

        <Paper className={styles.summary} elevation={1}>
          <Typography variant="h6" className={styles.summaryTitle}>Итого</Typography>
          <Divider sx={{ my: 2 }} />
          <Box className={styles.totalRow}>
            <Typography variant="h6">Сумма:</Typography>
            <Typography variant="h6" className={styles.totalAmount}>
              {cartTotal.toLocaleString('ru')} ₽
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            className={styles.checkoutBtn}
            onClick={() => navigate('/checkout')}
          >
            Перейти к оформлению
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
