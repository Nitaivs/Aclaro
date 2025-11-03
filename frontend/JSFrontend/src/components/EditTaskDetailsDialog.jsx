import {Dialog, DialogTitle, DialogContent, TextField} from '@mui/material';
import {useState, useEffect} from 'react';

export default function EditTaskDetailsDialog({currentName, currentDescription, onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState(currentName || "");
  const [descriptionInput, setDescriptionInput] = useState(currentDescription || "");
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setIsDialogOpen(isOpen);
  }, [isOpen]);

  /**
   * @function handleOnSave
   * @description Handles the save action for editing task details.
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
    onSave(nameInput, descriptionInput);
    setNameError(false);
    setNameInput(currentName || "");
    setDescriptionInput(currentDescription || "");
    onClose();
  }

  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle>Edit Task Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Name"
          required={true}
          type="text"
          fullWidth
          variant="outlined"
          error={nameError}
          helperText={nameError ? "Task name is required" : ""}
          defaultValue={currentName || ''}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Task Description"
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
          setNameInput(currentName ||"");
          setDescriptionInput(currentDescription || "");
          setNameError(false);
          onClose();
        }}>
          Cancel
        </button>
      </DialogContent>
    </Dialog>
  )
}
