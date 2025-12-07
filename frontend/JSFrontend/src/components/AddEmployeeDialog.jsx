import {Dialog, DialogTitle, TextField} from '@mui/material';
import {useState} from 'react';
import '../style/Dialog.css'

/**
 * @Component AddEmployeeDialog
 * @description A dialog component for adding a new employee.
 * @param onSave Callback function to handle saving the new employee.
 * @param isOpen Boolean to control the dialog open state.
 * @param onClose Callback function to handle closing the dialog.
 * @returns {JSX.Element} The AddEmployeeDialog component.
 */
export default function AddEmployeeDialog({onSave, isOpen, onClose}) {
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  //TODO: error currently does not distinguish between first and last name, fix later
  const [nameError, setNameError] = useState(false);

  /**
   * @function handleOnSave
   * @description Handles the save action when adding a new employee.
   * Validates the input and calls the onSave callback if valid.
   */
  function handleOnSave() {
    if (!firstNameInput || !lastNameInput) {
      setNameError(true);
      return;
    }
    onSave(firstNameInput, lastNameInput);
    handleClose()
  }

  /**
   * @function handleClose
   * @description Handles the close action for the dialog.
   * Resets the input fields and error state, then calls the onClose callback.
   */
  function handleClose() {
    setFirstNameInput("");
    setLastNameInput("");
    setNameError(false);
    onClose();
  }

  return (
    <Dialog
      slotProps={{
        paper: {
          className: 'dialog-paper'
        }
      }}
      open={isOpen}
      onClose={handleClose}>
      <div className="dialog-container">
        <div className="dialog-header">
          <h3>Add New Employee</h3>
        </div>
        <div className="dialog-actions">
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            required={true}
            error={nameError}
            helperText={nameError ? "First name is required" : ""}
            value={firstNameInput}
            onChange={(e) => setFirstNameInput(e.target.value)}
          />

          <TextField
            autoFocus
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            required={true}
            error={nameError}
            helperText={nameError ? "Last name is required" : ""}
            value={lastNameInput}
            onChange={(e) => setLastNameInput(e.target.value)}
          />

          <div className="dialog-actions-buttons">
            <button className="cancel-button" onClick={() => handleClose()}>Cancel</button>
            <button className="confirm-button" onClick={() => handleOnSave()}>Add</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

