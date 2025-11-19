import {Dialog, DialogTitle} from '@mui/material';

export default function ErrorDialog({isOpen, title, message, onClose}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div style={{padding: '20px'}}>
        <DialogTitle>{title}</DialogTitle>

        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </Dialog>
  );
}
