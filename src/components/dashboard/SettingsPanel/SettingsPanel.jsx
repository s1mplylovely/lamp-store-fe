import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Divider, TextField, Button } from '@mui/material';
import { updateProfile } from '../../../store/actions/authActions';
import styles from './SettingsPanel.module.css';

export function SettingsPanel({ user }) {
    const dispatch = useDispatch();
    const currentUser = useSelector((s) => s.auth.currentUser);
    const { loading } = useSelector((s) => s.auth);

    const [form, setForm] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
    });
    const set = (f, v) => setForm((prev) => ({ ...prev, [f]: v }));

    const handleSave = () => {
        dispatch(updateProfile({
            name: form.name,
            email: form.email,
            phone: form.phone,
        }));
    };

    return (
        <Box className={styles.settingsForm}>
            <TextField label="Ваше имя" fullWidth value={form.name} onChange={(e) => set('name', e.target.value)} />
            <TextField label="E-mail" fullWidth value={form.email} onChange={(e) => set('email', e.target.value)} />
            <TextField label="Телефон" fullWidth value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            <Button variant="contained" className={styles.saveBtn} onClick={handleSave} disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
        </Box>
    );
}