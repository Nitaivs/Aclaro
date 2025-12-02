import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import {useState} from "react";

export default function AddTaskDialog({onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [nameError, setNameError] = useState(false);

  //TODO: improve error handling across file

  async function handleOnSave() {
    try {
      if (!nameInput) {
        setNameError(true);
        return;
      }
      //TODO: only close dialog if onSave is successful
      await onSave(nameInput, descriptionInput);
      handleOnClose()
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  function handleOnClose() {
    setNameInput("");
    setDescriptionInput("");
    setNameError(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={handleOnClose}>
      <DialogTitle>Add New Task</DialogTitle>
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
