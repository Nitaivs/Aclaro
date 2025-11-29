import {useState} from 'react'
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import '../style/Dialog.css'

/**
 * @component AddProcessDialog
 * @description A dialog component for adding a new process.
 * Contains input fields for the process name and description,
 * and buttons to save or cancel the action.
 * @param {boolean} isOpen - Indicates whether the dialog is open.
 * @param {function} onSave - Callback function to handle saving the new process.
 * @param {function} onClose - Callback function to handle closing the dialog.
 * @returns {JSX.Element} The rendered AddProcessDialog component.
 */
export default function AddProcessDialog({isOpen, onSave, onClose}) {
  const [newProcessName, setNewProcessName] = useState("");
  const [newProcessDescription, setNewProcessDescription] = useState("");
  const [processNameError, setProcessNameError] = useState(false);

  /**
   * @function handleOnSave
   * @description Handles the save action when adding a new process.
   * Validates the input and calls the onSave callback with the new process details,
   * then calls handleOnClose to reset and close the dialog.
   */
  function handleOnSave() {
    if (!newProcessName) {
      setProcessNameError(true);
      return;
    }
    onSave(newProcessName, newProcessDescription);
    handleOnClose();
  }

  function handleOnClose() {
    setNewProcessName("");
    setNewProcessDescription("");
    setProcessNameError(false);
    onClose();
  }

  return (
    <Dialog
      slotProps={{
        paper: {
          className: "dialog-paper"
        }
      }}
      open={isOpen}
      onClose={handleOnClose}>
      <div className="dialog-container">
        <div className="dialog-header">
          <h3>Add New Process</h3>
        </div>
        <div className="dialog-actions">
          <TextField
            autoFocus
            margin="dense"
            label="Process Name"
            type="text"
            fullWidth
            variant="outlined"
            required={true}
            error={processNameError}
            helperText={processNameError ? "Process name is required" : ""}
            value={newProcessName}
            onChange={(e) => setNewProcessName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Process Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newProcessDescription}
            onChange={(e) => setNewProcessDescription(e.target.value)}
          />
          <div className="dialog-actions-buttons">
            <button className="cancel-button" onClick={() => handleOnClose()}>Cancel</button>
            <button className="confirm-button" onClick={() => handleOnSave()}>Add</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
