import {
  Box, Typography, Divider, FormGroup, FormControlLabel, Checkbox,
  TextField, Paper,
} from '@mui/material';
import styles from './FilterSidebar.module.css';

export const BASE_TYPES = ['E14', 'E27', 'E40', 'G4', 'G5.3', 'G9', 'GU5.3', 'GU10'];
export const COLORS = ['холодный белый', 'прозрачный', 'теплый белый', 'красный', 'синий', 'разноцветный'];
export const CATEGORIES = ['светодиодные', 'энергосберегающие', 'люминесцентные', 'накаливания'];

export default function FilterSidebar({ filters, onChange }) {
  const handleCheckbox = (group, value) => {
    const current = filters[group] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [group]: updated });
  };

  const handlePrice = (field, val) => {
    onChange({ ...filters, [field]: val });
  };

  return (
    <Paper className={styles.root} elevation={1}>
      <Typography variant="h6" className={styles.heading}>Фильтры</Typography>
      <Divider className={styles.divider} />

      {/* Цена */}
      <Box className={styles.section}>
        <Typography variant="subtitle2" className={styles.label}>Цена (₽)</Typography>
        <Box className={styles.priceRow}>
          <TextField
            size="small"
            label="От"
            type="number"
            value={filters.priceMin || ''}
            onChange={(e) => handlePrice('priceMin', e.target.value)}
            inputProps={{ min: 0 }}
          />
          <TextField
            size="small"
            label="До"
            type="number"
            value={filters.priceMax || ''}
            onChange={(e) => handlePrice('priceMax', e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Box>
      </Box>
      <Divider className={styles.divider} />

      {/* Категория */}
      <Box className={styles.section}>
        <Typography variant="subtitle2" className={styles.label}>Категория</Typography>
        <FormGroup>
          {CATEGORIES.map((cat) => (
            <FormControlLabel
              key={cat}
              control={
                <Checkbox
                  size="small"
                  checked={(filters.category || []).includes(cat)}
                  onChange={() => handleCheckbox('category', cat)}
                />
              }
              label={<Typography variant="body2">{cat}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
      <Divider className={styles.divider} />

      {/* Тип цоколя */}
      <Box className={styles.section}>
        <Typography variant="subtitle2" className={styles.label}>Тип цоколя</Typography>
        <FormGroup>
          {BASE_TYPES.map((b) => (
            <FormControlLabel
              key={b}
              control={
                <Checkbox
                  size="small"
                  checked={(filters.base || []).includes(b)}
                  onChange={() => handleCheckbox('base', b)}
                />
              }
              label={<Typography variant="body2">{b}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
      <Divider className={styles.divider} />

      {/* Цвет */}
      <Box className={styles.section}>
        <Typography variant="subtitle2" className={styles.label}>Цвет</Typography>
        <FormGroup>
          {COLORS.map((c) => (
            <FormControlLabel
              key={c}
              control={
                <Checkbox
                  size="small"
                  checked={(filters.color || []).includes(c)}
                  onChange={() => handleCheckbox('color', c)}
                />
              }
              label={<Typography variant="body2">{c}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
    </Paper>
  );
}
