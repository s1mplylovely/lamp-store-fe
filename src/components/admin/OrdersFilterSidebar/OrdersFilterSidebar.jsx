import {
    Box,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import { ORDER_STATUSES } from '../../../data/common';

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
        <Box>
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
        </Box>
    );
}