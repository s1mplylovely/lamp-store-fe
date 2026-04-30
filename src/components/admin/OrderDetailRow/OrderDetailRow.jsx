import {
    Box, Typography, Table, TableHead, TableBody, TableRow,
    TableCell, Select, MenuItem, FormControl, InputLabel, Grid
} from '@mui/material';
import { ORDER_STATUSES } from '../../../data/mockData';
import styles from './OrderDetailRow.module.css';

export function OrderDetailRow({ order }) {
    return (
        <Box className={styles.detail}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Телефон:</strong> {order.clientPhone}</Typography>
                    <Typography variant="body2"><strong>E-mail:</strong> {order.clientEmail}</Typography>
                    <Typography variant="body2"><strong>Адрес:</strong> {order.address}</Typography>
                    <Typography variant="body2">
                        <strong>Оплата:</strong> {order.paymentMethod === 'card' ? 'Банковская карта' : 'Наличные'}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
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
                                    <TableCell align="right">{item.price} ₽</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </Box>
    );
}