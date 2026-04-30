import { useState } from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import styles from './style.module.css';

export function PhoneForm({ onSuccess }) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (phone.length < 10) {
            setError('Введите корректный номер телефона');
            return;
        }
        setError('');
        onSuccess(phone);
    };

    return (
        <Box className={styles.form}>
            <TextField
                label="Номер телефона"
                fullWidth
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(''); }}
                error={!!error}
                helperText={error}
                placeholder="+7 (___) ___-__-__"
                InputProps={{
                    startAdornment: <InputAdornment position="start">+7</InputAdornment>,
                }}
            />
            <Button variant="contained" fullWidth className={styles.btn} onClick={handleSubmit}>
                Далее
            </Button>
        </Box>
    );
}