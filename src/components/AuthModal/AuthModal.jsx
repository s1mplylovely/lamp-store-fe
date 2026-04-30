import { Dialog, DialogContent, DialogTitle, Typography, Button, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import styles from './AuthModal.module.css';

export default function AuthModal({ open, message, onClose }) {
  const navigate = useNavigate();

  const handleAuth = () => {
    onClose();
    navigate('/auth');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className={styles.title}>
        <LockIcon className={styles.icon} />
        Требуется авторизация
      </DialogTitle>
      <DialogContent>
        <Typography className={styles.message}>{message}</Typography>
        <Box className={styles.actions}>
          <Button variant="outlined" onClick={onClose}>Закрыть</Button>
          <Button variant="contained" onClick={handleAuth} className={styles.authBtn}>
            Вход / Регистрация
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
