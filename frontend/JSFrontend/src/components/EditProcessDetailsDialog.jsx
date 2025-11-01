import {Dialog, DialogTitle, DialogContent, TextField} from '@mui/material';
import {useState, useEffect} from 'react';

export default function EditProcessDetailsDialog({currentName, currentDescription, onSave, isOpen}) {
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);

  useEffect(() => {
    setIsDialogOpen(isOpen);
  }, [isOpen]);

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
          onSave(nameInput, descriptionInput);
        }}>
          Save
        </button>

        <button onClick={() => {
          setNameInput("");
          setDescriptionInput("");
          setIsDialogOpen(false);
        }}>
          Cancel
        </button>
      </DialogContent>
    </Dialog>
  )
}
