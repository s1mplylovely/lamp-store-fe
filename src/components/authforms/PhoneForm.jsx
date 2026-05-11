import { useState } from 'react';
import { Box, TextField, Button, InputAdornment, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { requestCode } from '../../store/actions/authActions';
import styles from './style.module.css';

export function PhoneForm({ onSuccess }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((s) => s.auth);
    const [phone, setPhone] = useState('');

    const handleSubmit = async () => {
        if (phone.length < 10) return;
        await dispatch(requestCode(phone, 'phone'));
        onSuccess(phone);
    };

    return (
        <Box className={styles.form}>
            <TextField
                label="Номер телефона"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                error={!!error}
                helperText={error || ''}
                placeholder="9001234567"
                InputProps={{ startAdornment: <InputAdornment position="start">+7</InputAdornment> }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button variant="contained" fullWidth className={styles.btn}
                onClick={handleSubmit} disabled={loading || phone.length < 10}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Далее'}
            </Button>
        </Box>
    );
}