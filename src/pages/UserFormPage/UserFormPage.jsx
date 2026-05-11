import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Typography, Paper, Box, TextField, Button,
  FormControlLabel, Switch, Divider, Grid, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { fetchUser, createUser, updateUser } from '../../store/actions/userActions';
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
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const { current: existing, loading, saving } = useSelector((s) => s.users);

  const isNew = !id;
  const [form, setForm] = useState(emptyUser);

  useEffect(() => {
    if (!isNew) dispatch(fetchUser(id));
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (!isNew && existing) setForm({ ...existing });
  }, [existing, isNew]);

  if (!currentUser?.isAdmin) { navigate('/catalog'); return null; }
  if (!isNew && loading) return (
    <Container sx={{ pt: 6, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    if (isNew) {
      await dispatch(createUser(form));
    } else {
      await dispatch(updateUser(id, form));
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
          <Button variant="contained" startIcon={<SaveIcon />}
            className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
