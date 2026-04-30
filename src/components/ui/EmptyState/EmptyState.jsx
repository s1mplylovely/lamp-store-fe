import { Box, Typography, Button } from '@mui/material';
import styles from './EmptyState.module.css';

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <Box className={styles.root}>
      {/* Иконка */}
      {icon && <Box className={styles.icon}>{icon}</Box>}

      {/* Название */}
      <Typography variant="h5" className={styles.title}>{title}</Typography>

      {/* Описание */}
      {description && <Typography variant="body1" color="text.secondary">{description}</Typography>}

      {/* Кнопка */}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} className={styles.btn}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}