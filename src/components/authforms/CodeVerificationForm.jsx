import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useApp } from '../../context/AppContext';
import styles from './style.module.css';

const MOCK_CODE = '1234';

export function CodeVerificationForm({ contact, onVerified }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [resent, setResent] = useState(false);

    const handleVerify = () => {
        if (code !== MOCK_CODE) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            if (newAttempts >= 3) {
                setError('Повторите попытку');
                setResent(true);
            } else {
                setError(`Неверный код. Осталось попыток: ${3 - newAttempts}`);
            }
            return;
        }
        onVerified(contact);
    };

    return (
        <Box className={styles.form}>
            <Typography variant="body2" color="text.secondary">
                Код подтверждения отправлен на: <strong>{contact}</strong>
            </Typography>
            {resent && (
                <Alert severity="info">Вам отправлен новый код</Alert>
            )}
            <TextField
                label="Код подтверждения"
                fullWidth
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                error={!!error}
                helperText={error || 'Введите 4-значный код'}
                inputProps={{ maxLength: 6 }}
            />
            <Button
                variant="contained"
                fullWidth
                className={styles.btn}
                onClick={handleVerify}>
                Войти
            </Button>
        </Box>
    );
}