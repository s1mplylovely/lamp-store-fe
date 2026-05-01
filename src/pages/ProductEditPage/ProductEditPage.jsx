import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, Button, TextField, Grid, Paper,
  FormControlLabel, Radio, RadioGroup, FormLabel, Divider, Switch,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useApp } from '../../context/AppContext';
import { BASE_TYPES, COLORS, CATEGORIES } from '../../components/catalog/FilterSidebar/FilterSidebar';
import styles from './ProductEditPage.module.css';

const emptyProduct = {
  article: '',
  name: '',
  price: '',
  stock: '',
  category: 'светодиодные',
  base: 'E27',
  color: 'теплый белый',
  colorTemp: '',
  power: '',
  voltage: '220',
  flux: '',
  lifespan: '',
  weight: '',
  dimensions: { l: '', w: '', h: '' },
  description: '',
  visible: true,
};

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct, addProduct, currentUser } = useApp();

  const isNew = id === 'new';
  const existing = isNew ? null : products.find((p) => p.id === Number(id));

  const initial = existing
    ? { ...existing, price: String(existing.price), stock: String(existing.stock) }
    : emptyProduct;

  const [form, setForm] = useState(initial);
  const [filters, setFilters] = useState({});

  if (!currentUser?.isAdmin) {
    return <Container><Typography>Нет доступа</Typography></Container>;
  }

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const setDim = (dim, val) =>
    setForm((f) => ({ ...f, dimensions: { ...f.dimensions, [dim]: val } }));

  const handleSave = () => {
    const data = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      colorTemp: form.colorTemp ? Number(form.colorTemp) : null,
      power: Number(form.power),
      voltage: Number(form.voltage),
      flux: Number(form.flux),
      lifespan: Number(form.lifespan),
      weight: Number(form.weight),
      dimensions: {
        l: Number(form.dimensions.l),
        w: Number(form.dimensions.w),
        h: Number(form.dimensions.h),
      },
    };
    if (isNew) {
      addProduct(data);
    } else {
      updateProduct(existing.id, data);
    }
    navigate('/catalog');
  };

  const handleReset = () => setForm(initial);

  return (
    <Container maxWidth={false} className={styles.root}>
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

          <Typography variant="h5" className={styles.heading}>
            {isNew ? 'Новый товар' : 'Редактирование товара'}
          </Typography>

          <Paper className={styles.paper} elevation={1}>
            <Typography variant="h6" className={styles.sectionTitle}>Основная информация</Typography>
            <Grid container spacing={2}>
              <TextField label="Наименование" fullWidth value={form.name} onChange={(e) => set('name', e.target.value)} />
              <Grid item xs={12} sm={4}>
                <TextField label="Артикул" fullWidth value={form.article} onChange={(e) => set('article', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Цена (₽)" type="number" fullWidth value={form.price} onChange={(e) => set('price', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="В наличии (шт.)" type="number" fullWidth value={form.stock} onChange={(e) => set('stock', e.target.value)} />
              </Grid>
              <TextField label="Описание" fullWidth multiline rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" className={styles.sectionTitle}>Характеристики</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormLabel>Категория</FormLabel>
                <RadioGroup value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <FormControlLabel key={c} value={c} control={<Radio size="small" />} label={c} />
                  ))}
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormLabel>Тип цоколя</FormLabel>
                <RadioGroup value={form.base} onChange={(e) => set('base', e.target.value)}>
                  {BASE_TYPES.map((b) => (
                    <FormControlLabel key={b} value={b} control={<Radio size="small" />} label={b} />
                  ))}
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormLabel>Цвет</FormLabel>
                <RadioGroup value={form.color} onChange={(e) => set('color', e.target.value)}>
                  {COLORS.map((c) => (
                    <FormControlLabel key={c} value={c} control={<Radio size="small" />} label={c} />
                  ))}
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}><TextField label="Цветовая температура, К" type="number" fullWidth value={form.colorTemp} onChange={(e) => set('colorTemp', e.target.value)} /></Grid>
                  <Grid item xs={12}><TextField label="Мощность, Вт" type="number" fullWidth value={form.power} onChange={(e) => set('power', e.target.value)} /></Grid>
                  <Grid item xs={12}><TextField label="Напряжение, В" type="number" fullWidth value={form.voltage} onChange={(e) => set('voltage', e.target.value)} /></Grid>
                  <Grid item xs={12}><TextField label="Световой поток, лм" type="number" fullWidth value={form.flux} onChange={(e) => set('flux', e.target.value)} /></Grid>
                  <Grid item xs={12}><TextField label="Ресурс, часы" type="number" fullWidth value={form.lifespan} onChange={(e) => set('lifespan', e.target.value)} /></Grid>
                  <Grid item xs={12}><TextField label="Вес, г" type="number" fullWidth value={form.weight} onChange={(e) => set('weight', e.target.value)} /></Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <TextField label="Длина, см" type="number" fullWidth value={form.dimensions.l} onChange={(e) => setDim('l', e.target.value)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Ширина, см" type="number" fullWidth value={form.dimensions.w} onChange={(e) => setDim('w', e.target.value)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Высота, см" type="number" fullWidth value={form.dimensions.h} onChange={(e) => setDim('h', e.target.value)} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" className={styles.sectionTitle}>Фото товара</Typography>
            <Box className={styles.photoUpload}>
              <Button variant="outlined">Загрузить фото</Button>
              <Typography variant="caption" color="text.secondary">
                Форматы: JPG, PNG. Макс. размер: 5 МБ
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={!form.visible}
                  onChange={(e) => set('visible', !e.target.checked)}
                />
              }
              label="Скрыть с витрины"
            />

            <Box className={styles.buttons}>
              <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleReset}>
                Сбросить
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                className={styles.saveBtn}
              >
                Сохранить изменения
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
