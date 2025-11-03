import {Dialog, DialogTitle, DialogContent, TextField} from '@mui/material';
import {useState, useEffect} from 'react';

export default function EditProcessDetailsDialog({currentName, currentDescription, onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState(currentName || "");
  const [descriptionInput, setDescriptionInput] = useState(currentDescription || "");
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
    onSave(nameInput, descriptionInput);
    setIsDialogOpen(false);
    onClose();
  }

  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle>Edit Process Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Process Name"
          type="text"
          fullWidth
          variant="outlined"
          error={nameError}
          helperText={nameError ? "Process name is required" : ""}
          defaultValue={currentName || ''}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Process Description"
          type="text"
          fullWidth
          variant="outlined"
          defaultValue={currentDescription || ''}
          onChange={(e) => setDescriptionInput(e.target.value)}
        />

        <button onClick={() => {
          handleOnSave();
        }}>
          Save
        </button>

        <button onClick={() => {
          setNameInput("");
          setDescriptionInput("");
          setIsDialogOpen(false);
          onClose();
        }}>
          Cancel
        </button>
      </DialogContent>
    </Dialog>
  )
}
