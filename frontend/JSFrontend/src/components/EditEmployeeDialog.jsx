import {Dialog, DialogTitle, DialogContent, TextField} from '@mui/material';
import {useState, useEffect} from 'react';


export default function EditEmployeeDialog({currentName, onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState(currentName || "");
  const [nameError, setNameError] = useState(false);
  const [defaultName, setDefaultName] = useState(currentName || "")

  useEffect(() => {
    setDefaultName(currentName);
  }, [currentName]);

  /**
   * @function handleOnSave
   * @description Handles the save action for editing task details.
   * Validates the input and calls the onSave function with updated details.
   * Calls onClose to close the dialog after saving.
   */
  function handleOnSave() {
    if (nameInput === currentName) {
      onClose();
      return;
    }
    if (!nameInput) {
      setNameError(true);
      return;
    }
    onSave(nameInput);
    handleClose()
  }

  function handleClose() {
    setNameInput(currentName || "");
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
          label="Employee Name"
          required={true}
          type="text"
          fullWidth
          variant="outlined"
          error={nameError}
          helperText={nameError ? "Employee name is required" : ""}
          defaultValue={defaultName || ''}
          onChange={(e) => setNameInput(e.target.value)}
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
