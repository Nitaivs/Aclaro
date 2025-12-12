import {Dialog, DialogTitle} from '@mui/material';
import '../style/Dialog.css'

/**
 * @component ErrorDialog
 * @description A dialog component for displaying error messages.
 * @param {boolean} isOpen - Boolean to control the dialog open state.
 * @param {String} title - The title of the error dialog.
 * @param {String} message - The error message to be displayed.
 * @param {boolean} onClose - Callback function to handle closing the dialog.
 * @returns {React.JSX.Element} The rendered ErrorDialog component.
 */
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
