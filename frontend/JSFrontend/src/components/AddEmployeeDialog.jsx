import {Dialog, DialogTitle, TextField} from '@mui/material';
import {useState, useEffect} from 'react';

export default function AddEmployeeDialog({onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setIsDialogOpen(isOpen);
  }, [isOpen]);

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

