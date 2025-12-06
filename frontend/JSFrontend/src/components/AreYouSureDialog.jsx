import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import '../style/Dialog.css'

export default function AreYouSureDialog({message, title, isOpen, onConfirm, onCancel}) {
  return (
    <Dialog
      slotProps={{
        paper: {
          className: 'dialog-paper'
        }
      }}
      open={isOpen}
      onClose={onCancel}>
      <div className="dialog-container">
        <div className="dialog-header">
          <h3>{title || "Are you sure?"}</h3>
        </div>
        <div className="dialog-content">
          <p>{message || "Are you sure you want to proceed with this action?"}</p>
        </div>
        <div className="dialog-actions">
          <div className="dialog-actions-buttons">
            <button className="cancel-button" onClick={onConfirm} autoFocus>Confirm</button>
            <button className="confirm-button" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
