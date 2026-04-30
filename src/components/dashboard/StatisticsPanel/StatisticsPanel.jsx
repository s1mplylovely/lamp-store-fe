import { Chip, Box, Typography, Paper, Grid } from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { CHART_DATA } from '../../../data/mockData';
import styles from './StatisticsPanel.module.css';

export function StatisticsPanel({ orders }) {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((o) => o.date === today);
    const revenueToday = todayOrders.reduce((s, o) => s + o.total, 0);
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

    // Топ-3
    const productSales = {};
    orders.forEach((o) => {
        o.items.forEach((item) => {
            productSales[item.name] = (productSales[item.name] || 0) + item.qty;
        });
    });
    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <Box className={styles.stats}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                    <Paper className={styles.statCard} elevation={1}>
                        <Typography variant="h4" className={styles.statNum}>{todayOrders.length}</Typography>
                        <Typography variant="body2" color="text.secondary">Заказов сегодня</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper className={styles.statCard} elevation={1}>
                        <Typography variant="h4" className={styles.statNum}>{revenueToday.toLocaleString('ru')} ₽</Typography>
                        <Typography variant="body2" color="text.secondary">Выручка сегодня</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper className={styles.statCard} elevation={1}>
                        <Typography variant="h4" className={styles.statNum}>{orders.length}</Typography>
                        <Typography variant="body2" color="text.secondary">Всего заказов</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper className={styles.statCard} elevation={1}>
                        <Typography variant="h4" className={styles.statNum}>{totalRevenue.toLocaleString('ru')} ₽</Typography>
                        <Typography variant="body2" color="text.secondary">Общая выручка</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box className={styles.box}>
                <Paper className={styles.chartPaper} elevation={1}>
                    <Typography variant="h6" className={styles.chartTitle}>Заказы за 7 дней</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={CHART_DATA}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="orders" stroke="var(--dark)" strokeWidth={2} dot={{ fill: "var(--accent)" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
                <Paper className={styles.topPaper} elevation={1}>
                    <Typography variant="h6" className={styles.chartTitle}>Топ-3 товара</Typography>
                    {topProducts.map(([name, qty], i) => (
                        <Box key={name} className={styles.topRow}>
                            <Chip label={`#${i + 1}`} size="small" className={styles.rankChip} />
                            <Typography variant="body2" className={styles.topName}>{name}</Typography>
                            <Typography variant="body2" color="text.secondary">{qty} шт.</Typography>
                        </Box>
                    ))}
                </Paper>
            </Box>
        </Box >
    );
}