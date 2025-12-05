import {Dialog, DialogTitle} from '@mui/material';
import '../style/Dialog.css'

export default function ErrorDialog({isOpen, title, message, onClose}) {
  return (
    <Dialog
      slotProps={{
        paper: {
          className: 'dialog-paper'
        }
      }}
      open={isOpen}
      onClose={onClose}>
      <div className="dialog-container">
        <div className="dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="dialog-content">
          <p>{message}</p>
        </div>
        <div className={"dialog-actions"}>
          <div className="dialog-actions-buttons">
            <button className={"cancel-button"} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
