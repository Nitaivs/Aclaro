import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import {useEffect, useState} from "react";

export default function AddTaskDialog({onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [nameError, setNameError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);

  useEffect(() => {
    setIsDialogOpen(isOpen);
  }, [isOpen]);

  function handleOnSave() {
    if (!nameInput) {
      setNameError(true);
      return;
    }
    onSave(nameInput, descriptionInput);
    setNameInput("");
    setDescriptionInput("");
    onClose();
  }

  return (
    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
      <DialogTitle>Add New Process</DialogTitle>
      <div style={{padding: '0 24px 24px 24px'}}>
        <TextField
          autoFocus
          margin="dense"
          label="Task Name"
          type="text"
          fullWidth
          variant="outlined"
          required={true}
          error={nameError}
          helperText={nameError ? "Task name is required" : ""}
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Task Description"
          type="text"
          fullWidth
          variant="outlined"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
        />
        <button onClick={() => handleOnSave()}>Add</button>
        <button onClick={() => {
          setNameInput("");
          setDescriptionInput("");
          onClose();
        }}>Cancel
        </button>
      </div>
    </Dialog>
  )
}
