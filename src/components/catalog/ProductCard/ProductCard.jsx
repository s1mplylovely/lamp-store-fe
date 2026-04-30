import {
  Card, CardContent, CardActions, Typography, Button, Chip, Box, IconButton, Tooltip
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { currentUser, addToCart } = useApp();
  const isAdmin = currentUser?.isAdmin;

  return (
    <Card className={styles.card} elevation={1}>

      <Box className={styles.imageArea} onClick={() => navigate(`/catalog/${product.id}`)}>
        <LightbulbOutlinedIcon className={styles.productIcon} />
        {!product.visible && (
          <Chip label="Скрыт" size="small" className={styles.hiddenChip} />
        )}
      </Box>

      <CardContent className={styles.content}>
        {/* Название */}
        <Typography
          variant="body1"
          className={styles.name}
          onClick={() => navigate(`/catalog/${product.id}`)}
        >
          {product.name}
        </Typography>

        {/* Артикул */}
        <Typography variant="caption" color="text.secondary">
          Арт. {product.article}
        </Typography>

        {/* Теэги */}
        <Box className={styles.meta}>
          <Chip
            label={product.colorTemp !== null ? `${product.color} (${product.colorTemp} K)` : `${product.color}`}
            size="small"
            variant="outlined" />
          <Chip label={`${product.power} Вт`} size="small" variant="outlined" />
        </Box>

        <Box className={styles.priceRow}>
          {/* Цена */}
          <Typography variant="h6" className={styles.price}>{product.price} ₽</Typography>
          {/* Количество */}
          <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
            {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
          </Typography>
        </Box>
      </CardContent>

      {/* Редактировать для админа, в корзину для клента */}
      <CardActions className={styles.actions}>
        {isAdmin ? (
          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/catalog/${product.id}/edit`)}
            className={styles.btn}
            fullWidth
          >
            Редактировать товар
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className={styles.btn}
            fullWidth
          >
            Добавить в корзину
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
