import { useState } from 'react';
import {
  Box, Typography, Divider, FormGroup, FormControlLabel, Checkbox, Accordion, AccordionSummary,
  AccordionDetails, TextField, Paper, Drawer, IconButton, Button, useMediaQuery, useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import styles from './FilterSidebar.module.css';

export const BASE_TYPES = ['E14', 'E27', 'E40', 'G4', 'G5.3', 'G9', 'GU5.3', 'GU10'];
export const COLORS = ['холодный белый', 'прозрачный', 'теплый белый', 'красный', 'синий', 'разноцветный'];
export const CATEGORIES = ['светодиодные', 'энергосберегающие', 'люминесцентные', 'накаливания'];

function FilterContent({ filters, onChange }) {
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
    <Box>
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
    </Box>
  );
}

export default function FilterSidebar({ filters, onChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setDrawerOpen(true)}
          className={styles.filterBtn}
          size="small"
        >
          Фильтры
        </Button>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ className: styles.filterDrawer }}
        >
          <Box className={styles.filterDrawerHeader}>
            <Typography variant="h6" className={styles.heading}>Фильтры</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box className={styles.filterDrawerBody}>
            <FilterContent filters={filters} onChange={onChange} />
          </Box>
          <Box className={styles.filterDrawerFooter}>
            <Button
              variant="contained"
              fullWidth
              className={styles.applyBtn}
              onClick={() => setDrawerOpen(false)}
            >
              Применить
            </Button>
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <Paper className={styles.root} elevation={1}>
      <Typography variant="h6" className={styles.heading}>Фильтры</Typography>
      <FilterContent filters={filters} onChange={onChange} />
    </Paper>
  );
}