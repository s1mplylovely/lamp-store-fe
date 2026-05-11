import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
    Chip, Accordion, AccordionSummary, AccordionDetails, Button, CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplayIcon from '@mui/icons-material/Replay';
import { ORDER_STATUSES, STATUS_COLORS } from '../../../data/mockData';
import { fetchOrderItems } from '../../../store/actions/orderActions';
import { addToCart } from '../../../store/actions/cartActions';
import styles from './OrderCard.module.css';

export function OrderCard({ order }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((s) => s.products.items);

    const handleExpand = (_, expanded) => {
        if (expanded && (!order.items || order.items.length === 0)) {
            dispatch(fetchOrderItems(order.id));
        }
    };

    const handleRepeat = (e) => {
        e.stopPropagation();
        if (!order.items?.length) return;
        order.items.forEach((item) => {
            const product = products.find((p) => p.id === item.productId) ?? {
                id: item.productId, name: item.name, price: item.price,
            };
            dispatch(addToCart(product));
        });
        navigate('/cart');
    };

    const statusLabel = ORDER_STATUSES[order.status] ?? order.status;
    const statusColor = STATUS_COLORS[order.status] ?? 'default';

    return (
        <Accordion className={styles.orderCard} onChange={handleExpand}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box className={styles.orderHeader}>
                    <Typography variant="body2" className={styles.orderId}>{order.id}</Typography>
                    <Typography variant="body2" color="text.secondary">{order.date}</Typography>
                    <Chip label={statusLabel} color={statusColor} size="small" />
                    <Typography variant="body1" className={styles.orderTotal}>
                        {order.total.toLocaleString('ru')} ₽
                    </Typography>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ReplayIcon />}
                        onClick={handleRepeat}
                    >
                        Повторить
                    </Button>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
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
                                <TableCell align="right">Сумма</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell align="right">{item.qty}</TableCell>
                                    <TableCell align="right">{item.price?.toLocaleString('ru')} ₽</TableCell>
                                    <TableCell align="right">{(item.price * item.qty).toLocaleString('ru')} ₽</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </AccordionDetails>
        </Accordion>
    );
}