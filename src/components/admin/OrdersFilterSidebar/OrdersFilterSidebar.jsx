import {
    Paper,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import { ORDER_STATUSES } from '../../../data/mockData';
import styles from './OrdersFilterSidebar.module.css';

export default function OrdersFilterSidebar({
    filterStatus,
    setFilterStatus,
    filterPayment,
    setFilterPayment,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
}) {
    return (
        <Paper className={styles.sidebar} elevation={1}>
            <Typography variant="h6" className={styles.sidebarTitle}>
                Фильтры
            </Typography>
            <Divider sx={{ my: 1 }} />

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Статус</InputLabel>
                <Select
                    label="Статус"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <MenuItem value="">Все</MenuItem>
                    {Object.entries(ORDER_STATUSES).map(([val, label]) => (
                        <MenuItem key={val} value={val}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Способ оплаты</InputLabel>
                <Select
                    label="Способ оплаты"
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                >
                    <MenuItem value="">Все</MenuItem>
                    <MenuItem value="card">Банковская карта</MenuItem>
                    <MenuItem value="cash">Наличные</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="body2" sx={{ mb: 1 }}>
                Дата заказа
            </Typography>

            <TextField
                label="С"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                sx={{ mb: 1 }}
            />

            <TextField
                label="По"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
            />
        </Paper>
    );
}