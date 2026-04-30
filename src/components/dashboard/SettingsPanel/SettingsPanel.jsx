import { useState } from 'react';
import { Box, Divider, TextField, Button } from '@mui/material';
import styles from './SettingsPanel.module.css';

export function SettingsPanel({ user }) {
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const set = (f, v) => setForm((prev) => ({ ...prev, [f]: v }));

    return (
        <Box className={styles.settingsForm}>
            <TextField label="Ваше имя" fullWidth value={form.name} onChange={(e) => set('name', e.target.value)} />
            <TextField label="E-mail" fullWidth value={form.email} onChange={(e) => set('email', e.target.value)} />
            <TextField label="Телефон" fullWidth value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            <Button variant="contained" className={styles.saveBtn}>Сохранить</Button>
        </Box>
    );
}