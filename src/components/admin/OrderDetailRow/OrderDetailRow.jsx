import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box, Typography, Table, TableHead, TableBody, TableRow,
    TableCell, Grid, CircularProgress,
} from '@mui/material';
import { ORDER_STATUSES } from '../../../data/mockData';
import { fetchOrderItems } from '../../../store/actions/orderActions';
import styles from './OrderDetailRow.module.css';

export function OrderDetailRow({ order, expanded }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (expanded && (!order.items || order.items.length === 0)) {
            dispatch(fetchOrderItems(order.id));
        }
    }, [expanded, order.id]);

    return (
        <Box className={styles.detail}>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                    <Typography variant="body2"><strong>Адрес:</strong> {order.address}</Typography>
                    <Typography variant="body2">
                        <strong>Оплата:</strong> {order.paymentMethod === 'карта' ? 'Банковская карта' : 'Наличные'}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Статус:</strong> {ORDER_STATUSES[order.status] ?? order.status}
                    </Typography>
                    {order.comment && (
                        <Typography variant="body2"><strong>Комментарий:</strong> {order.comment}</Typography>
                    )}
                </Grid>
                <Grid xs={12} sm={6}>
                    {!order.items || order.items.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Товар</TableCell>
                                    <TableCell align="right">Кол-во</TableCell>
                                    <TableCell align="right">Цена</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.items.map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell align="right">{item.qty}</TableCell>
                                        <TableCell align="right">{item.price?.toLocaleString('ru')} ₽</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}