import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Box, Typography, Paper, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, IconButton, Button, Tooltip, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import { fetchUsers, deleteUser } from '../../store/actions/userActions';
import DeleteDialog from '../../components/ui/DeleteDialog';
import styles from './UserManagementPage.module.css';

export default function UserManagementPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((s) => s.auth.currentUser);
  const { items: users, loading } = useSelector((s) => s.users);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');

  if (!currentUser?.isAdmin) {
    navigate('/catalog');
    return null;
  }

  useEffect(() => {
    dispatch(fetchUsers({ search: search || undefined }));
  }, [dispatch, search]);

  const handleDelete = async () => {
    if (!selectedUser) return;

    await dispatch(deleteUser(selectedUser.id));

    setDeleteOpen(false);
    setSelectedUser(null);
  };

  return (
    <Container maxWidth="lg" className={styles.root}>
      <Box className={styles.topBar}>
        <Typography variant="h4" className={styles.heading}>
          Управление пользователями
        </Typography>

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
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Поиск по ID, имени, e-mail или телефону..."
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box className={styles.tableWrapper}>
          <Paper elevation={1} sx={{ overflow: 'hidden', minWidth: 650 }}>
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
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    className={
                      user.id === currentUser.id ? styles.myRow : ''
                    }
                  >
                    <TableCell>{user.id}</TableCell>

                    <TableCell>
                      <Box className={styles.userCell}>
                        {user.name}

                        {user.id === currentUser.id && (
                          <Chip
                            label="вы"
                            size="small"
                            className={styles.meChip}
                          />
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
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/admin/users/${user.id}/edit`)
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Удалить">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={user.id === currentUser.id}
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteOpen(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ py: 4, color: '#999' }}
                    >
                      Пользователи не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          <DeleteDialog
            open={deleteOpen}
            onClose={() => {
              setDeleteOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={handleDelete}
            entity="пользователя"
          />
        </Box>
      )}
    </Container>
  );
}