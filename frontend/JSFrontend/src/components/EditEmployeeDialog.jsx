import {Dialog, DialogTitle, DialogContent, TextField} from '@mui/material';
import {useState, useEffect} from 'react';


export default function EditEmployeeDialog({currentFirstName, currentLastName, onSave, isOpen, onClose}) {
  const [firstNameInput, setFirstNameInput] = useState(currentFirstName || "");
  const [lastNameInput, setLastNameInput] = useState(currentLastName || "");
  //TODO: error currently does not distinguish between first and last name, fix later
  const [nameError, setNameError] = useState(false);
  const [defaultFirstName, setDefaultFirstName] = useState(currentFirstName || "")
  const [defaultLastName, setDefaultLastName] = useState(currentLastName || "")

  useEffect(() => {
    setDefaultFirstName(currentFirstName);
    setDefaultLastName(currentLastName);
    setFirstNameInput(currentFirstName);
    setLastNameInput(currentLastName);
  }, [currentFirstName, currentLastName]);

  /**
   * @function handleOnSave
   * @description Handles the save action for editing task details.
   * Validates the input and calls the onSave function with updated details.
   * Calls onClose to close the dialog after saving.
   */
  function handleOnSave() {
    if (firstNameInput === currentFirstName && lastNameInput === currentLastName) {
      handleClose()
      return;
    }
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
    // setFirstNameInput(currentFirstName || "");
    // setLastNameInput(currentLastName || "");
    setNameError(false);
    onClose();
  }

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Edit Employee</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          required={true}
          type="text"
          fullWidth
          variant="outlined"
          error={nameError}
          helperText={nameError ? "First name is required" : ""}
          defaultValue={defaultFirstName || ''}
          onChange={(e) => setFirstNameInput(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Last Name"
          required={true}
          type="text"
          fullWidth
          variant="outlined"
          error={nameError}
          helperText={nameError ? "Last name is required" : ""}
          defaultValue={defaultLastName || ''}
          onChange={(e) => setLastNameInput(e.target.value)}
        />

        <button onClick={() => {
          handleOnSave();
        }}>
          Save
        </button>

        <button onClick={() => {
          handleClose();
        }}>
          Cancel
        </button>
      </DialogContent>
    </Dialog>
  )
}
