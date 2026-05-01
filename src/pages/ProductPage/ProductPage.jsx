import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Chip, Divider, Table, TableBody,
  TableRow, TableCell, Switch, FormControlLabel, Dialog, DialogTitle,
  DialogContent, DialogActions, Paper, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useApp } from '../../context/AppContext';
import DeleteDialog from '../../components/ui/DeleteDialog';
import styles from './ProductPage.module.css';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, currentUser, addToCart, deleteProduct, updateProduct } = useApp();
  const isAdmin = currentUser?.isAdmin;

  const [filters, setFilters] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Typography>Товар не найден.</Typography>
        <Button component={Link} to="/catalog" startIcon={<ArrowBackIcon />}>
          Вернуться в каталог
        </Button>
      </Container>
    );
  }

  const handleDelete = () => {
    deleteProduct(product.id);
    setDeleteOpen(false);
    navigate('/catalog');
  };

  const handleVisibilityToggle = () => {
    updateProduct(product.id, { visible: !product.visible });
  };

  const specs = [
    { label: 'Категория', value: product.category },
    { label: 'Тип цоколя', value: product.base },
    { label: 'Цвет', value: product.color },
    { label: 'Цветовая температура, К', value: product.colorTemp ?? '—' },
    { label: 'Мощность, Вт', value: product.power },
    { label: 'Напряжение, В', value: product.voltage },
    { label: 'Световой поток, лм', value: product.flux },
    { label: 'Ресурс, часы', value: product.lifespan.toLocaleString('ru') },
    { label: 'Вес, г', value: product.weight },
    {
      label: 'Габаритные размеры упаковки, см',
      value: `${product.dimensions.l} × ${product.dimensions.w} × ${product.dimensions.h}`,
    },
  ];

  return (
    <Container maxWidth="xl" className={styles.root}>
      <Box className={styles.layout}>

        <Box className={styles.main}>
          <Button
            component={Link}
            to="/catalog"
            startIcon={<ArrowBackIcon />}
            className={styles.backBtn}
          >
            Вернуться в каталог
          </Button>

          <Grid container spacing={4}>
            {/* Картинка */}
            <Grid item xs={12} md={4}>
              <Paper className={styles.imageBox} elevation={1}>
                <LightbulbOutlinedIcon className={styles.productIcon} />
                {!product.visible && (
                  <Chip label="Скрыт с витрины" color="warning" className={styles.hiddenChip} />
                )}
              </Paper>
            </Grid>

            {/* Информация */}
            <Grid item xs={12} md={8}>
              <Typography variant="h4" className={styles.name}>{product.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Арт. {product.article}
              </Typography>

              <Typography variant="h4" className={styles.price}>{product.price} ₽</Typography>

              <Typography variant="body1" color={product.stock > 0 ? 'success.main' : 'error.main'} sx={{ mb: 2 }}>
                {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
              </Typography>

              <Typography variant="body1" className={styles.description}>{product.description}</Typography>

              {isAdmin && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={product.visible}
                      onChange={handleVisibilityToggle}
                    />
                  }
                  label={product.visible ? 'Видимый на витрине' : 'Скрыт с витрины'}
                  sx={{ mb: 2 }}
                />
              )}

              {/* Кнопки админа */}
              <Box className={styles.actionRow}>
                {isAdmin ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/catalog/${product.id}/edit`)}
                      className={styles.editBtn}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteOpen(true)}
                    >
                      Удалить
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={styles.cartBtn}
                  >
                    Добавить в корзину
                  </Button>
                )}
              </Box>
            </Grid>

            {/* Храктеристики */}
            <Grid item xs={12}>
              <Typography variant="h6" className={styles.specsTitle}>Характеристики</Typography>
              <Paper elevation={0} variant="outlined">
                <Table size="small">
                  <TableBody>
                    {specs.map((s) => (
                      <TableRow key={s.label} hover>
                        <TableCell className={styles.specLabel}>{s.label}</TableCell>
                        <TableCell>{s.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Подтверждение удаления */}
      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        entity='товар'
      />
    </Container>
  );
}
