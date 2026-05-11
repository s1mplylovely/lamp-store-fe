import { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { requestCode } from '../../store/actions/authActions';
import styles from './style.module.css';

export function EmailForm({ onSuccess }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((s) => s.auth);
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        if (!email.includes('@')) return;
        await dispatch(requestCode(email, 'email'));
        onSuccess(email);
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
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button variant="contained" fullWidth className={styles.btn}
                onClick={handleSubmit} disabled={loading || !email.includes('@')}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Далее'}
            </Button>
        </Box>
    );
}