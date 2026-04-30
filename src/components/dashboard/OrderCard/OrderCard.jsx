import { useState } from 'react';
import {
    Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
    Chip, Accordion, AccordionSummary, AccordionDetails, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplayIcon from '@mui/icons-material/Replay';
import { useApp } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ORDER_STATUSES, STATUS_COLORS } from '../../../data/mockData';
import styles from './OrderCard.module.css';

export function OrderCard({ order }) {
    const { addToCart } = useApp();
    const navigate = useNavigate();

    const handleRepeat = () => {
        order.items.forEach((item) => {
            addToCart({ id: item.productId, name: item.name, price: item.price }, item.qty);
        });
        navigate('/cart');
    };

    return (
        <Accordion className={styles.orderCard}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box className={styles.orderHeader}>
                    <Typography variant="body1" className={styles.orderId}>{order.id}</Typography>
                    <Typography variant="body2" color="text.secondary">{order.date}</Typography>
                    <Chip
                        label={ORDER_STATUSES[order.status]}
                        color={STATUS_COLORS[order.status]}
                        size="small"
                    />
                    <Typography variant="body1" className={styles.orderTotal}>
                        {order.total.toLocaleString('ru')} ₽
                    </Typography>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ReplayIcon />}
                        onClick={(e) => { e.stopPropagation(); handleRepeat(); }}
                    >
                        Повторить заказ
                    </Button>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Товар</TableCell>
                            <TableCell align="right">Кол-во</TableCell>
                            <TableCell align="right">Цена</TableCell>
                            <TableCell align="right">Сумма</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.items.map((item, i) => (
                            <TableRow key={i}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">{item.qty}</TableCell>
                                <TableCell align="right">{item.price} ₽</TableCell>
                                <TableCell align="right">{(item.price * item.qty).toLocaleString('ru')} ₽</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}