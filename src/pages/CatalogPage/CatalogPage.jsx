import { useState, useMemo } from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import FilterSidebar from '../../components/catalog/FilterSidebar/FilterSidebar';
import ProductCard from '../../components/catalog/ProductCard/ProductCard';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useApp } from '../../context/AppContext';
import styles from './CatalogPage.module.css';

const defaultFilters = {
  priceMin: '',
  priceMax: '',
  base: [],
  color: [],
  category: [],
};

export default function CatalogPage() {
  const { products, currentUser } = useApp();
  const navigate = useNavigate();
  const isAdmin = currentUser?.isAdmin;

  const [filters, setFilters] = useState(defaultFilters);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!isAdmin && !p.visible) return false;

      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.article.toLowerCase().includes(q)) return false;
      }
      if (filters.priceMin && p.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && p.price > Number(filters.priceMax)) return false;
      if (filters.base.length && !filters.base.includes(p.base)) return false;
      if (filters.color.length && !filters.color.includes(p.color)) return false;
      if (filters.category.length && !filters.category.includes(p.category)) return false;
      return true;
    });
  }, [products, filters, search, isAdmin]);

  const handleAddNew = () => {
    navigate('/catalog/new/edit');
  };

  return (
    <Container maxWidth="xl" className={styles.root}>

      <Box className={styles.layout}>
        {/* Фильтры */}
        <FilterSidebar filters={filters} onChange={setFilters} />

        {/* Заголовок + добавить товар (админ) */}
        <Box className={styles.listArea}>
          {isAdmin && (
            <Box className={styles.adminBar}>
              <Typography variant="h5" className={styles.heading}>Каталог товаров</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                className={styles.addBtn}
              >
                Добавить новый товар
              </Button>
            </Box>
          )}

          {!isAdmin && (
            <Typography variant="h5" className={styles.heading}>Каталог товаров</Typography>
          )}

          {/* Поиск */}
          <Box className={styles.searchRow}>
            <SearchBar value={search} onChange={setSearch} />
          </Box>

          {/* Товары или EmptyState */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={<LightbulbOutlinedIcon style={{ fontSize: 64 }} />}
              title="Товары не найдены"
              description="Попробуйте изменить параметры фильтрации или поискового запроса"
            />
          ) : (
            <Grid container spacing={2}>
              {filtered.map((p) => (
                <Grid item key={p.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={p} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
}