import { useState, useMemo } from 'react';
import {
  Container, Box, Typography, Paper, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, IconButton, Button, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '../../components/ui/DeleteDialog';
import styles from './UserManagementPage.module.css';

export default function UserManagementPage() {
  const { users, deleteUser, currentUser } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteUserId, setDeleteUserId] = useState(null);

  if (!currentUser?.isAdmin) {
    navigate('/catalog');
    return null;
  }

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        String(u.id).includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );
  }, [users, search]);

  const handleConfirmDelete = () => {
    deleteUser(deleteUserId);
    setDeleteUserId(null);
  };

  const userToDelete = users.find(u => u.id === deleteUserId);

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Box className={styles.topBar}>
        <Typography variant="h4" className={styles.heading}>Управление пользователями</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className={styles.addBtn}
          onClick={() => navigate('/admin/users/new')}
        >
          Добавить пользователя
        </Button>
      </Box>

      <Box className={styles.searchRow}>
        <SearchBar value={search} onChange={setSearch} placeholder="Поиск по ID, имени, e-mail или телефону..." />
      </Box>

      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell align="center">Заблокирован</TableCell>
              <TableCell align="center">Админ</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id} hover className={user.id === currentUser.id ? styles.myRow : ''}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Box className={styles.userCell}>
                    {user.name}
                    {user.id === currentUser.id && (
                      <Chip label="вы" size="small" className={styles.meChip} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={user.isBlocked ? 'да' : 'нет'}
                    color={user.isBlocked ? 'error' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={user.isAdmin ? 'да' : 'нет'}
                    color={user.isAdmin ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Редактировать">
                    <IconButton size="small" onClick={() => navigate(`/admin/users/${user.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteUserId(user.id)}
                        disabled={user.id === currentUser.id}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#999' }}>
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      <DeleteDialog
        open={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleConfirmDelete}
        entity="пользователя"
      />
    </Container>
  );
}