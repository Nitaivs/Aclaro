import {Dialog, DialogTitle, DialogContent, TextField} from '@mui/material';
import {useEffect, useState} from 'react';

export default function EditTaskDetailsDialog({currentName, currentDescription, onSave, isOpen, onClose}) {
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
    handleOnClose();
  }

  function handleOnClose() {
    setNameInput(currentName || "");
    setDescriptionInput(currentDescription || "");
    setNameError(false);
    onClose();
  }

  return (
    <Dialog open={isOpen}>
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
          defaultValue={defaultName || ''}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Task Description"
          type="text"
          fullWidth
          variant="outlined"
          defaultValue={defaultDescription || ''}
          onChange={(e) => setDescriptionInput(e.target.value)}
        />

        <button onClick={() => {
          handleOnSave();
        }}>
          Save
        </button>

        <button onClick={() => {
          handleOnClose();
        }}>
          Cancel
        </button>
      </DialogContent>
    </Dialog>
  )
}
