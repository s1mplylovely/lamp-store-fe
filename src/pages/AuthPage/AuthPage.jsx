import { useState } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, TextField, Button, Alert,
  InputAdornment, Container,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { EmailForm } from '../../components/forms/EmailForm'
import { PhoneForm } from '../../components/forms/PhoneForm'
import { CodeVerificationForm } from '../../components/forms/CodeVerificationForm'
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, loginAsCustomer, loginAsAdmin } = useApp();
  const [tab, setTab] = useState(0);
  const [step, setStep] = useState('form'); // form | code
  const [contact, setContact] = useState('');

  const handleTabChange = (_, val) => {
    setTab(val);
    setStep('form');
    setContact('');
  };

  const handleSuccess = (value) => {
    setContact(value);
    setStep('code');
  };

  const handleVerified = (value) => {
    const success = login(value);
    if (success) {
    navigate('/catalog');
    }
  };

  return (
    <Box className={styles.page}>
      <Container maxWidth="sm">
        <Paper className={styles.card} elevation={3}>
          <Typography variant="h5" className={styles.title}>Вход / Регистрация</Typography>

          {/* Телефон или email */}
          {step === 'form' && (
            <>
              <Tabs value={tab} onChange={handleTabChange} centered className={styles.tabs}>
                <Tab label="По телефону" />
                <Tab label="По e-mail" />
              </Tabs>
              <Box className={styles.tabBody}>
                {tab === 0 ? (
                  <PhoneForm onSuccess={handleSuccess} />
                ) : (
                  <EmailForm onSuccess={handleSuccess} />
                )}
              </Box>
            </>
          )}

          {/* Код */}
          {step === 'code' && (
            <Box className={styles.tabBody}>
              <CodeVerificationForm contact={contact} onVerified={handleVerified} />
              {/* Назад */}
              <Button
                variant="text"
                onClick={() => setStep('form')}
                fullWidth
                sx={{ mt: 1 }}
              >
                ← Изменить {tab === 0 ? 'телефон' : 'e-mail'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
