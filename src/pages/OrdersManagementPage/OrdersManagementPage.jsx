import { useState, useMemo } from 'react';
import {
  Container, Box, Typography, Paper, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, IconButton, Tooltip, Collapse
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import { useApp } from '../../context/AppContext';
import { ORDER_STATUSES, STATUS_COLORS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { OrderDetailRow } from '../../components/admin/OrderDetailRow/OrderDetailRow';
import OrdersFilterSidebar from '../../components/admin/OrdersFilterSidebar/OrdersFilterSidebar';
import styles from './OrdersManagementPage.module.css';

export default function OrdersManagementPage() {
  const { orders, updateOrder, deleteOrder, currentUser } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expanded, setExpanded] = useState(null);

  if (!currentUser?.isAdmin) {
    navigate('/catalog');
    return null;
  }

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (search) {
        const q = search.toLowerCase();
        if (!o.id.toLowerCase().includes(q)) return false;
      }
      if (filterStatus && o.status !== filterStatus) return false;
      if (filterPayment && o.paymentMethod !== filterPayment) return false;
      if (dateFrom && o.date < dateFrom) return false;
      if (dateTo && o.date > dateTo) return false;
      return true;
    });
  }, [orders, search, filterStatus, filterPayment, dateFrom, dateTo]);

  return (
    <Container maxWidth="xl" className={styles.root}>
      <Typography variant="h4" className={styles.heading}>Управление заказами</Typography>

      <Box className={styles.layout}>
        {/* Фильтры */}
        <OrdersFilterSidebar
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPayment={filterPayment}
          setFilterPayment={setFilterPayment}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />

        {/* Контент */}
        <Box className={styles.main}>
          <Box className={styles.searchRow}>
            <SearchBar value={search} onChange={setSearch} placeholder="Поиск по номеру заказа..." />
          </Box>

          <Paper elevation={1} sx={{ overflow: 'hidden' }}>
            <Table>
              <TableHead className={styles.tableHead}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Клиент</TableCell>
                  <TableCell align="right">Сумма</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="center">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((order) => (
                  <>
                    <TableRow key={order.id} hover>
                      <TableCell><strong>{order.id}</strong></TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.clientName}</TableCell>
                      <TableCell align="right">{order.total.toLocaleString('ru')} ₽</TableCell>
                      <TableCell>
                        <Chip
                          label={ORDER_STATUSES[order.status]}
                          color={STATUS_COLORS[order.status]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Редактировать">
                          <IconButton size="small" onClick={() => navigate(`/admin/orders/${order.id}/edit`)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton size="small" color="error" onClick={() => deleteOrder(order.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={expanded === order.id ? 'Свернуть' : 'Развернуть'}>
                          <IconButton size="small" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                            {expanded === order.id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`${order.id}-detail`}>
                      <TableCell colSpan={6} sx={{ padding: 0, borderBottom: 0 }}>
                        <Collapse in={expanded === order.id}>
                          <OrderDetailRow order={order} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'var(--bottom-text)' }}>
                      Заказы не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
