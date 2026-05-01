import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, TextField, Button,
  FormControlLabel, Switch, Divider, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useApp } from '../../context/AppContext';
import styles from './UserFormPage.module.css';

const emptyUser = {
  name: '',
  email: '',
  phone: '',
  isBlocked: false,
  isAdmin: false,
};

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, addUser, updateUser, currentUser } = useApp();

  const isNew = !id;
  const existing = isNew ? null : users.find((u) => u.id === Number(id));

  const [form, setForm] = useState(existing ? { ...existing } : emptyUser);

  if (!currentUser?.isAdmin) {
    navigate('/catalog');
    return null;
  }

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (isNew) {
      addUser(form);
    } else {
      updateUser(existing.id, form);
    }
    navigate('/admin/users');
  };

  return (
    <Container maxWidth="sm" className={styles.root}>
      <Button
        component={Link}
        to="/admin/users"
        startIcon={<ArrowBackIcon />}
        className={styles.backBtn}
      >
        Не сохранять и вернуться
      </Button>

      <Typography variant="h5" className={styles.heading}>
        {isNew ? 'Новый пользователь' : 'Редактирование пользователя'}
      </Typography>

      <Paper className={styles.paper} elevation={1}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Имя"
              fullWidth
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Телефон"
              fullWidth
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box className={styles.toggles}>
          <FormControlLabel
            control={
              <Switch
                checked={form.isBlocked}
                onChange={(e) => set('isBlocked', e.target.checked)}
                color="error"
              />
            }
            label="Заблокирован"
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isAdmin}
                onChange={(e) => set('isAdmin', e.target.checked)}
                color="primary"
              />
            }
            label="Администратор"
          />
        </Box>

        <Box className={styles.buttons}>
          <Button variant="outlined" component={Link} to="/admin/users">
            Не сохранять и вернуться
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            className={styles.saveBtn}
            onClick={handleSave}
          >
            Сохранить
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
