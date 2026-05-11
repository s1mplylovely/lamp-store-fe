import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Container, CircularProgress, useMediaQuery, useTheme, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../store/actions/productActions';
import FilterSidebar from '../../components/catalog/FilterSidebar/FilterSidebar';
import ProductCard from '../../components/catalog/ProductCard/ProductCard';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import styles from './CatalogPage.module.css';

const defaultFilters = {
  priceMin: '',
  priceMax: '',
  base: [],
  color: [],
  category: [],
};

export default function CatalogPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const { items: products, loading, error } = useSelector((s) => s.products);
  const isAdmin = currentUser?.isAdmin;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [filters, setFilters] = useState(defaultFilters);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({
      search,
      price_min: filters.priceMin || undefined,
      price_max: filters.priceMax || undefined,
      base: filters.base.length ? filters.base : undefined,
      color: filters.color.length ? filters.color : undefined,
      category: filters.category.length ? filters.category : undefined,
      visible: isAdmin ? undefined : true,
    }));
  }, [dispatch, search, filters, isAdmin]);

  return (
    <Container maxWidth="xl" className={styles.root}>

      <Box className={styles.layout}>
        {/* Фильтры */}
        {!isMobile && <FilterSidebar filters={filters} onChange={setFilters} />}

        {/* Заголовок + добавить товар (админ) */}
        <Box className={styles.listArea}>
          {isAdmin && (
            <Box className={styles.adminBar}>
              <Typography variant="h5" className={styles.heading}>Каталог товаров</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/catalog/new/edit')}
                className={styles.addBtn}
              >
                Добавить товар
              </Button>
            </Box>
          )}

          {!isAdmin && (
            <Typography variant="h5" className={styles.heading}>Каталог товаров</Typography>
          )}

          {/* Фильтры */}
          {isMobile && <FilterSidebar filters={filters} onChange={setFilters} />}

          {/* Поиск */}
          <Box className={styles.searchRow}>
            <SearchBar value={search} onChange={setSearch} />
          </Box>

          {/* Товары или EmptyState */}
          <Box className={styles.listArea}>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
                <CircularProgress />
              </Box>
            )}
            {!loading && error && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            {!loading && !error && products.length === 0 && (
              <EmptyState
                icon={<LightbulbOutlinedIcon style={{ fontSize: 64 }} />}
                title="Товары не найдены"
                description="Попробуйте изменить параметры фильтрации или поискового запроса"
              />
            )}
            {!loading && !error && products.length > 0 && (
              <Grid container spacing={2}>
                {products.map((p) => (
                  <Grid item key={p.id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard product={p} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}