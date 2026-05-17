import { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Stack } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { requestCode, register } from '../../store/actions/authActions';
import styles from './style.module.css';

function formatPhoneNumber(phone) {
    if (phone.length === 11 && (phone[0] === '7' || phone[0] === '8')) {
        phone = phone.slice(1);
    }
    const areaCode = phone.slice(0, 3);
    const firstPart = phone.slice(3, 6);
    const secondPart = phone.slice(6, 8);
    const thirdPart = phone.slice(8, 10);

    return `+7 (${areaCode}) ${firstPart}-${secondPart}-${thirdPart}`;
}

export function PhoneForm({ onSuccess }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((s) => s.auth);
    const [phone, setPhone] = useState('');
    const [action, setAction] = useState(null); // 'signin' | 'signup'

    const isValid = phone.length >= 11;
    const fullPhone = formatPhoneNumber(phone);

    const handleSignin = async () => {
        if (!isValid) return;
        setAction('signin');
        const result = await dispatch(requestCode(fullPhone, 'phone'));
        if (result) onSuccess(fullPhone);
    };

    const handleSignup = async () => {
        if (!isValid) return;
        setAction('signup');
        const result = await dispatch(register({ phone: fullPhone }));
        if (result) onSuccess(fullPhone);
    };

    return (
        <Box className={styles.form}>
            <TextField
                label="Номер телефона"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                error={!!error}
                helperText={error || ''}
                placeholder="89001234567"
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