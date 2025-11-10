import {Dialog, DialogTitle, TextField} from '@mui/material';
import {useState, useEffect} from 'react';

/**
 * @Component AddEmployeeDialog
 * @description A dialog component for adding a new employee.
 * @param onSave Callback function to handle saving the new employee.
 * @param isOpen Boolean to control the dialog open state.
 * @param onClose Callback function to handle closing the dialog.
 * @returns {JSX.Element} The AddEmployeeDialog component.
 */
export default function AddEmployeeDialog({onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);
  const [nameError, setNameError] = useState(false);

  /**
   * UseEffect hook to update the dialog open state when the isOpen prop changes.
   */
  useEffect(() => {
    setIsDialogOpen(isOpen);
  }, [isOpen]);

  /**
   * Handles the save action when adding a new employee.
   * Validates the input and calls the onSave callback if valid.
   */
  function handleOnSave() {
    if (!nameInput) {
      setNameError(true);
      return;
    }
    onSave(nameInput);
    setNameInput("");
    onClose();
  }

  return (
    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
      <DialogTitle>Add New Employee</DialogTitle>
      <div style={{padding: '0 24px 24px 24px'}}>
        <TextField
          autoFocus
          margin="dense"
          label="Employee Name"
          type="text"
          fullWidth
          variant="outlined"
          required={true}
          error={nameError}
          helperText={nameError ? "Employee name is required" : ""}
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button onClick={() => handleOnSave()}>Add</button>
        <button onClick={() => {
          setNameInput("");
          onClose();
        }}>Cancel
        </button>
      </div>
    </Dialog>
  )
}

