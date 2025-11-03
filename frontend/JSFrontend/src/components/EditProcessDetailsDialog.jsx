import {Dialog, DialogTitle, DialogContent, TextField} from '@mui/material';
import {useState, useEffect} from 'react';

/**
 * @component EditProcessDetailsDialog
 * @description A dialog component for editing the details of a process.
 * @param currentName The current name of the process.
 * @param currentDescription The current description of the process.
 * @param onSave Function to call when saving the updated details.
 * @param isOpen Boolean indicating if the dialog is open.
 * @param onClose Function to call when closing the dialog.
 * @returns {JSX.Element} The rendered EditProcessDetailsDialog component.
 */
export default function EditProcessDetailsDialog({currentName, currentDescription, onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState(currentName || "");
  const [descriptionInput, setDescriptionInput] = useState(currentDescription || "");
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setIsDialogOpen(isOpen);
  }, [isOpen]);

  /**
   * @function handleOnSave
   * @description Handles the save action for editing process details.
   * Validates the input and calls the onSave function with updated details.
   * Calls onClose to close the dialog after saving.
   */
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
