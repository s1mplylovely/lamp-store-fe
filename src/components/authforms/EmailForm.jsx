import { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Stack } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { requestCode, register } from '../../store/actions/authActions';
import styles from './style.module.css';

export function EmailForm({ onSuccess }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((s) => s.auth);
    const [email, setEmail] = useState('');
    const [action, setAction] = useState(null); // 'signin' | 'signup'

    const isValid = email.includes('@') && email.includes('.');

    const handleSignin = async () => {
        if (!isValid) return;
        setAction('signin');
        const result = await dispatch(requestCode(email, 'email'));
        if (result) onSuccess(email);
    };

    const handleSignup = async () => {
        if (!isValid) return;
        setAction('signup');
        const result = await dispatch(register({ email }));
        if (result) onSuccess(email);
    };

    return (
        <Box className={styles.form}>
            <TextField
                label="E-mail"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error || ''}
                placeholder="example@mail.ru"
                onKeyDown={(e) => e.key === 'Enter' && handleSignin()}
            />
            <Stack spacing={1}>
                <Button
                    variant="contained"
                    fullWidth
                    className={styles.btn}
                    onClick={handleSignin}
                    disabled={loading}
                >
                    {loading && action === 'signin'
                        ? <CircularProgress size={22} color="inherit" />
                        : 'Войти'}
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    className={styles.btn}
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading && action === 'signup'
                        ? <CircularProgress size={22} color="inherit" />
                        : 'Зарегистрироваться'}
                </Button>
            </Stack>
        </Box>
    );
}