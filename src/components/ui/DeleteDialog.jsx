import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

export default function DeleteDialog({
  open,
  onClose,
  onConfirm,
  entity,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Удалить {entity}?</DialogTitle>
      <DialogContent>
        <Typography>
          Вы собираетесь удалить {entity}. Это действие нельзя отменить.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
}