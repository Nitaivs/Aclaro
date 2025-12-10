import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import {useState} from "react";
import '../style/Dialog.css'

/**
 * @component AddTaskDialog
 * @description A dialog component for adding a new task.
 * Contains input fields for the task name and description,
 * and buttons to save or cancel the action.
 * @param {function} onSave Callback function to handle saving the new task.
 * @param {function} isOpen
 * @param {function} onClose
 * @returns {React.JSX.Element} The rendered AddTaskDialog component.
 */
export default function AddTaskDialog({onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [nameError, setNameError] = useState(false);

  /**
   * @function handleOnSave
   * @description Handles the save action when adding a new task.
   * Validates the input and calls the onSave callback if valid.
   * @returns {Promise<void>} A promise that resolves when the save operation is complete.
   */
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

  /**
   * @function handleOnClose
   * @description Handles the close action for the dialog.
   * Resets the input fields and error state, then calls the onClose callback.
   */
  function handleOnClose() {
    setNameInput("");
    setDescriptionInput("");
    setNameError(false);
    onClose();
  }

  return (
    <Dialog
      slotProps={{
        paper: {
          className: 'dialog-paper'
        }
      }}
      open={isOpen}
      onClose={handleOnClose}>
      <div className="dialog-container">
        <div className="dialog-header">
        <h3>Add New Task</h3>
        </div>
        <div className="dialog-actions">
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
          <div className="dialog-actions-buttons">
            <button className="cancel-button" onClick={() => handleOnClose()}>Cancel</button>
            <button className="confirm-button" onClick={() => handleOnSave()}>Add</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
