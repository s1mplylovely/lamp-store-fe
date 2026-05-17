import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Container, Typography, Button, TextField, Grid, Paper, CircularProgress,
  FormControlLabel, Radio, RadioGroup, FormLabel, Divider, Switch,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { fetchProduct, createProduct, updateProduct } from '../../store/actions/productActions';
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
  length: '',
  width: '',
  height: '',
  description: '',
  visible: true,
};

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const { current: existing, loading, saving } = useSelector((s) => s.products);

  const isNew = id === 'new';
  const [form, setForm] = useState(emptyProduct);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (!isNew) dispatch(fetchProduct(id));
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (!isNew && existing) {
      setForm({ ...existing, price: String(existing.price), stock: String(existing.stock) });
    }
  }, [existing, isNew]);

  if (!currentUser?.isAdmin) return <Container><Typography>Нет доступа</Typography></Container>;
  if (!isNew && loading) return <Container sx={{ pt: 6, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
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
      length: Number(form.length),
      width: Number(form.width),
      height: Number(form.height),
    };
    if (isNew) {
      await dispatch(createProduct(data));
    } else {
      await dispatch(updateProduct(existing.id, data));
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
              {[['Цветовая температура, К', 'colorTemp'], ['Мощность, Вт', 'power'], ['Напряжение, В', 'voltage'],
              ['Световой поток, лм', 'flux'], ['Ресурс, часы', 'lifespan'], ['Вес, г', 'weight']].map(([label, field]) => (
                <Grid item xs={6} sm={4} key={field}>
                  <TextField label={label} type="number" fullWidth value={form[field]} onChange={(e) => set(field, e.target.value)} />
                </Grid>
              ))}
              <Grid item xs={4}><TextField label="Длина, см" type="number" fullWidth value={form.length} onChange={(e) => set('length', e.target.value)} /></Grid>
              <Grid item xs={4}><TextField label="Ширина, см" type="number" fullWidth value={form.width} onChange={(e) => set('width', e.target.value)} /></Grid>
              <Grid item xs={4}><TextField label="Высота, см" type="number" fullWidth value={form.height} onChange={(e) => set('height', e.target.value)} /></Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" className={styles.sectionTitle}>Фото товара</Typography>
            <Box className={styles.photoUpload}>
              <TextField label="URL фото" fullWidth value={form.image} onChange={(e) => set('image', e.target.value)} />
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
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}
                className={styles.saveBtn} disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
