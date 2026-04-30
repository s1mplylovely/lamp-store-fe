import {
  Box, Typography, Divider, FormGroup, FormControlLabel, Checkbox,
  TextField, Paper, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  const renderCheckboxGroup = (title, items, keyName) => (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        '&:before': {
          backgroundColor: 'var(--light)',
        },
      }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" className={styles.label}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {items.map((item) => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  size="small"
                  checked={(filters[keyName] || []).includes(item)}
                  onChange={() => handleCheckbox(keyName, item)}
                />
              }
              label={<Typography variant="body2">{item}</Typography>}
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Paper className={styles.root} elevation={1}>
      <Typography variant="h6" className={styles.heading}>Фильтры</Typography>

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

      {renderCheckboxGroup('Категория', CATEGORIES, 'category')}
      <Divider className={styles.divider} />

      {renderCheckboxGroup('Тип цоколя', BASE_TYPES, 'base')}
      <Divider className={styles.divider} />

      {renderCheckboxGroup('Цвет', COLORS, 'color')}
    </Paper>
  );
}