import {Dialog, TextField} from '@mui/material';
import {useState, useEffect} from 'react';
import '../style/Dialog.css'

/**
 * @component EditProcessDetailsDialog
 * @description A dialog component for editing the details of a process.
 * @param currentName The current name of the process.
 * @param currentDescription The current description of the process.
 * @param onSave Function to call when saving the updated details.
 * @param isOpen Boolean indicating if the dialog is open.
 * @param onClose Function to call when closing the dialog.
 * @returns {JSX.Element} The rendered EditProcessDetailsDialog component.
 */
export default function EditProcessDetailsDialog({currentName, currentDescription, onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState(currentName || "");
  const [descriptionInput, setDescriptionInput] = useState(currentDescription || "");
  const [nameError, setNameError] = useState(false);
  const [defaultName, setDefaultName] = useState(currentName || "")
  const [defaultDescription, setDefaultDescription] = useState(currentDescription || "")

  useEffect(() => {
    setDefaultName(currentName);
    setDefaultDescription(currentDescription);
    setNameInput(currentName);
    setDescriptionInput(currentDescription);
  }, [currentName, currentDescription]);

  /**
   * @function handleOnSave
   * @description Handles the save action for editing process details.
   * Validates the input and calls the onSave function with updated details.
   * Calls onClose to close the dialog after saving.
   */
  function handleOnSave() {
    if (nameInput === currentName && descriptionInput === currentDescription) {
      onClose();
      return;
    }
    if (!nameInput) {
      setNameError(true);
      return;
    }
    setNameError(false);
    onSave(nameInput, descriptionInput);
    handleOnClose();
  }

  /**
   * @function handleOnClose
   * @description Handles the close action for the dialog.
   * Resets the input state and calls the onClose callback.
   */
  function handleOnClose() {
    setNameInput(currentName || "");
    setDescriptionInput(currentDescription || "");
    setNameError(false);
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
          <h3>Edit Process Details</h3>
        </div>
        <div className="dialog-actions">
          <TextField
            autoFocus
            margin="dense"
            label="Process Name"
            type="text"
            fullWidth
            variant="outlined"
            error={nameError}
            helperText={nameError ? "Process name is required" : ""}
            defaultValue={defaultName || ''}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Process Description"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={defaultDescription || ''}
            onChange={(e) => setDescriptionInput(e.target.value)}
          />
          <div className="dialog-actions-buttons">
            <button className="cancel-button" onClick={() => handleOnClose()}>Cancel</button>
            <button className="confirm-button" onClick={() => handleOnSave()}>Save</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
