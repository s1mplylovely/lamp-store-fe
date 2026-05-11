import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { verifyCode } from '../../store/actions/authActions';
import styles from './style.module.css';

export function CodeVerificationForm({ contact, onBack }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, currentUser, devCode } = useSelector((s) => s.auth);
    const [code, setCode] = useState('');

    useEffect(() => {
        if (currentUser) navigate('/catalog');
    }, [currentUser, navigate]);

    const handleVerify = () => {
        if (code.length < 4) return;
        dispatch(verifyCode(contact, code));
    };

    return (
        <Box className={styles.form}>
            <Typography variant="body2" color="text.secondary">
                Код подтверждения отправлен на: <strong>{contact}</strong>
            </Typography>

            {/* dev only код из ответа бэкенда */}
            <Collapse in={!!devCode}>
                <Alert severity="warning">
                    <strong>DEV:</strong> ваш код <strong>{devCode}</strong>
                </Alert>
            </Collapse>

            <TextField
                label="Код подтверждения"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                error={!!error}
                helperText={error || 'Введите 4-значный код'}
                inputProps={{ maxLength: 6 }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            {error && (
                <Alert severity="warning" sx={{ py: 0 }}>
                    Неверный код. Попробуйте ещё раз.
                </Alert>
            )}
            <Button variant="contained" fullWidth className={styles.btn}
                onClick={handleVerify} disabled={loading || code.length < 4}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Войти'}
            </Button>
            <Button variant="text" fullWidth onClick={onBack}>
                ← Изменить контакт
            </Button>
        </Box>
    );
}