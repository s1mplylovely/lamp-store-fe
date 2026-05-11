import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Tabs, Tab, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SettingsPanel } from '../../components/dashboard/SettingsPanel/SettingsPanel';
import { StatisticsPanel } from '../../components/dashboard/StatisticsPanel/StatisticsPanel';
import { OrderCard } from '../../components/dashboard/OrderCard/OrderCard';
import { fetchMyOrders } from '../../store/actions/orderActions';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const { myOrders, loading } = useSelector((s) => s.orders);

  const [tab, setTab] = useState(0);

  if (!currentUser) {
    navigate('/catalog');
    return null;
  }

  const isAdmin = currentUser.isAdmin;

  useEffect(() => {
    if (!isAdmin && tab === 0) dispatch(fetchMyOrders());
  }, [dispatch, isAdmin, tab]);

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Typography variant="h4" className={styles.heading}>
        {isAdmin ? 'Панель администратора' : 'Личный кабинет'}
      </Typography>

      <Paper elevation={1}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} className={styles.tabs}>
          <Tab label={isAdmin ? 'Статистика' : 'Заказы'} />
          <Tab label="Настройки" />
        </Tabs>

        <Box className={styles.tabContent}>
          {tab === 0 && (
            isAdmin ? (
              <StatisticsPanel />
            ) : loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                <CircularProgress />
              </Box>
            ) : myOrders.length === 0 ? (
              <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
                У вас пока нет заказов
              </Typography>
            ) : (
              myOrders.map((o) => <OrderCard key={o.id} order={o} />)
            )
          )}
          {tab === 1 && <SettingsPanel />}
        </Box>
      </Paper>
    </Container>
  );
}