import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { fetchStatistics } from '../../../store/actions/orderActions';
import styles from './StatisticsPanel.module.css';

export function StatisticsPanel() {
    const dispatch = useDispatch();
    const { statistics, statisticsLoading, statisticsError } = useSelector((s) => s.orders);

    useEffect(() => {
        dispatch(fetchStatistics());
    }, [dispatch]);

    if (statisticsLoading || !statistics) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (statisticsError) {
        return (
            <Typography color="error" sx={{ p: 4, textAlign: 'center' }}>
                Ошибка загрузки статистики: {statisticsError}
            </Typography>
        );
    }

    const {
        orders_today,
        revenue_today,
        orders_total,
        revenue_total,
        chart,
        top_products,
    } = statistics;

    return (
        <Box className={styles.stats}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                    <Paper className={styles.statCard} elevation={1}>
                        <Typography variant="h4" className={styles.statNum}>{orders_today}</Typography>
                        <Typography variant="body2" color="text.secondary">Заказов сегодня</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper className={styles.statCard} elevation={1}>
                        <Typography variant="h4" className={styles.statNum}>{revenue_today.toLocaleString('ru')} ₽</Typography>
                        <Typography variant="body2" color="text.secondary">Выручка сегодня</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper className={styles.statCard} elevation={1}>
                        <Typography variant="h4" className={styles.statNum}>{orders_total}</Typography>
                        <Typography variant="body2" color="text.secondary">Всего заказов</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper className={styles.statCard} elevation={1}>
                        <Typography variant="h4" className={styles.statNum}>{revenue_total.toLocaleString('ru')} ₽</Typography>
                        <Typography variant="body2" color="text.secondary">Общая выручка</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box className={styles.box}>
                <Paper className={styles.chartPaper} elevation={1}>
                    <Typography variant="h6" className={styles.chartTitle}>Заказы за 7 дней</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={chart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                formatter={(value, name) =>
                                    name === 'revenue'
                                        ? [`${value.toLocaleString('ru')} ₽`, 'Выручка']
                                        : [value, 'Заказы']
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="var(--dark)"
                                strokeWidth={2}
                                dot={{ fill: 'var(--accent)' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>

                <Paper className={styles.topPaper} elevation={1}>
                    <Typography variant="h6" className={styles.chartTitle}>Топ-3 товара</Typography>
                    {top_products.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            Нет данных
                        </Typography>
                    ) : (
                        top_products.map((product, i) => (
                            <Box key={product.product_id} className={styles.topRow}>
                                <Chip label={`#${i + 1}`} size="small" className={styles.rankChip} />
                                <Typography variant="body2" className={styles.topName}>{product.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{product.quantity} шт.</Typography>
                            </Box>
                        ))
                    )}
                </Paper>
            </Box>
        </Box>
    );
}