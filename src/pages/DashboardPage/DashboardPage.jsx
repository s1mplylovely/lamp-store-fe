import { useState } from 'react';
import { Container, Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { SettingsPanel } from '../../components/dashboard/SettingsPanel/SettingsPanel';
import { StatisticsPanel } from '../../components/dashboard/StatisticsPanel/StatisticsPanel';
import { OrderCard } from '../../components/dashboard/OrderCard/OrderCard';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { currentUser, myOrders, orders } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  if (!currentUser) {
    navigate('/catalog');
    return null;
  }

  const isAdmin = currentUser.isAdmin;

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Typography variant="h4" className={styles.heading}>
        {isAdmin ? 'Панель администратора' : 'Личный кабинет'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {currentUser.name}
      </Typography>

      <Paper elevation={1}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} className={styles.tabs}>
          <Tab label={isAdmin ? 'Статистика' : 'Заказы'} />
          <Tab label="Настройки" />
        </Tabs>

        <Box className={styles.tabContent}>
          {tab === 0 && (
            isAdmin
              ? <StatisticsPanel orders={orders} />
              : (
                myOrders.length === 0
                  ? <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>У вас пока нет заказов</Typography>
                  : myOrders.map((o) => <OrderCard key={o.id} order={o} />)
              )
          )}
          {tab === 1 && <SettingsPanel user={currentUser} />}
        </Box>
      </Paper>
    </Container>
  );
}