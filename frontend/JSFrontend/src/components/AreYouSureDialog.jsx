import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
export default function AreYouSureDialog({message, title, isOpen, onConfirm, onCancel}) {
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>{title || "Are you sure?"}</DialogTitle>
      <DialogContent>
        <p>{message || "Are you sure you want to proceed with this action?"}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="secondary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
