import {Dialog, DialogTitle, TextField} from '@mui/material';
import {useState} from 'react';

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
    <Dialog open={isOpen}>
      <DialogTitle>Add New Employee</DialogTitle>
      <div style={{padding: '0 24px 24px 24px'}}>
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

        <button onClick={() => handleOnSave()}>Add</button>
        <button onClick={() => {
          handleClose();
        }}>
          Cancel
        </button>
      </div>
    </Dialog>
  )
}

