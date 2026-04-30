import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styles from './QuantitySelector.module.css';

export default function QuantitySelector({ value, onIncrement, onDecrement, min = 1 }) {
  return (
    <Box className={styles.root}>
      <IconButton size="small" onClick={onDecrement} disabled={value <= min}>
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography className={styles.value}>{value}</Typography>
      <IconButton size="small" onClick={onIncrement}>
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
