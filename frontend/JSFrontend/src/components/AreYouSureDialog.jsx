import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import '../style/Dialog.css'

/**
 * @component AreYouSureDialog
 * @description A dialog component that prompts the user with a confirmation message.
 * @param {String} message - The confirmation message to display in the dialog.
 * @param {String} title - The title of the dialog.
 * @param {boolean} isOpen - Indicates whether the dialog is open.
 * @param {function} onConfirm - Callback function to handle the confirm action.
 * @param {function} onCancel - Callback function to handle the cancel action.
 * @returns {React.JSX.Element} The rendered AreYouSureDialog component.
 */
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
