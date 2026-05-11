import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Box, Typography, Paper, Table, TableHead, TableBody, Divider,
  TableRow, TableCell, Chip, IconButton, Tooltip, Collapse, Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import { fetchOrders, deleteOrder } from '../../store/actions/orderActions';
import { fetchUsers } from '../../store/actions/userActions';
import { ORDER_STATUSES, STATUS_COLORS } from '../../data/mockData';
import { OrderDetailRow } from '../../components/admin/OrderDetailRow/OrderDetailRow';
import OrdersFilterSidebar from '../../components/admin/OrdersFilterSidebar/OrdersFilterSidebar';
import DeleteDialog from '../../components/ui/DeleteDialog';
import styles from './OrdersManagementPage.module.css';

export default function OrdersManagementPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const { items: orders, loading } = useSelector((s) => s.orders);
  const users = useSelector((s) => s.users.items);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!currentUser?.isAdmin) { navigate('/catalog'); return null; }

  useEffect(() => {
    dispatch(fetchOrders({
      search: search || undefined,
      status: filterStatus || undefined,
      payment_method: filterPayment || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }));
  }, [dispatch, search, filterStatus, filterPayment, dateFrom, dateTo]);

  useEffect(() => {
    if (users.length === 0) dispatch(fetchUsers({ limit: 200 }));
  }, [dispatch]);

  const getClientName = (userId) => {
    const u = users.find((u) => u.id === userId);
    if (!u) return userId?.slice(0, 8) + '…';
    return u.name || u.email || u.phone || userId?.slice(0, 8) + '…';
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    return o.id.includes(search) || o.userId?.includes(search);
  });

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    await dispatch(deleteOrder(selectedOrder.id));
    setDeleteOpen(false);
    setSelectedOrder(null);
  };

  const filterProps = {
    filterStatus, setFilterStatus, filterPayment, setFilterPayment,
    dateFrom, setDateFrom, dateTo, setDateTo,
  };

  return (
    <Container maxWidth="xl" className={styles.root}>
      <Typography variant="h4" className={styles.heading}>Управление заказами</Typography>

      {/* Фильтры mobile */}
      <Box className={styles.sidebarMobile}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setMobileFiltersOpen((v) => !v)}
          size="small"
          sx={{ mb: 1, borderColor: 'var(--dark)', color: 'var(--dark)' }}
        >
          Фильтры {mobileFiltersOpen ? '▲' : '▼'}
        </Button>
        <Collapse in={mobileFiltersOpen}>
          <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
            <OrdersFilterSidebar {...filterProps} />
          </Paper>
        </Collapse>
      </Box>

      <Box className={styles.layout}>
        {/* Фильтры desktop */}
        <Paper className={[styles.sidebar, styles.sidebarDesktop].join(' ')} elevation={1}>
          <Typography variant="h6" className={styles.sidebarTitle}>Фильтры</Typography>
          <Divider sx={{ my: 1 }} />
          <OrdersFilterSidebar {...filterProps} />
        </Paper>

        {/* Контент */}
        <Box className={styles.main}>
          <Box className={styles.searchRow}>
            <SearchBar value={search} onChange={setSearch} placeholder="Поиск по номеру заказа..." />
          </Box>

          <Box className={styles.tableWrapper}>
            <Paper elevation={1}>
              <Table sx={{ minWidth: 600 }}>
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
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                            {order.id.slice(0, 8)}…
                          </Typography>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{getClientName(order.userId)}</TableCell>
                        <TableCell align="right">{order.total?.toLocaleString('ru')} ₽</TableCell>
                        <TableCell>
                          <Chip
                            label={ORDER_STATUSES[order.status] ?? order.status}
                            color={STATUS_COLORS[order.status] ?? 'default'}
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
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(order)}>
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
                            <OrderDetailRow order={order} expanded={expanded === order.id} />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                  {filtered.length === 0 && !loading && (
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
      </Box>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setSelectedOrder(null); }}
        onConfirm={handleDelete}
        entity="заказ"
      />
    </Container>
  );
}