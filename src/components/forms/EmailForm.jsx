import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useApp } from '../../context/AppContext';
import styles from './style.module.css';

export function EmailForm({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!email.includes('@')) {
            setError('E-mail не существует');
            return;
        }
        setError('');
        onSuccess(email);
    };

    return (
        <Box className={styles.form}>
            <TextField
                label="E-mail"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                error={!!error}
                helperText={error}
                placeholder="example@mail.ru"
            />
            <Button variant="contained" fullWidth className={styles.btn} onClick={handleSubmit}>
                Далее
            </Button>
        </Box>
    );
}