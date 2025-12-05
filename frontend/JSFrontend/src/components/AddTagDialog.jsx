import {Dialog, DialogTitle, TextField} from '@mui/material';
import {useState} from 'react';
import '../style/Dialog.css';

/**
 * @Component AddTagDialog
 * @description A dialog component for adding a new tag.
 * @param onSave Callback function to handle saving the new tag.
 * @param isOpen Boolean to control the dialog open state.
 * @param onClose Callback function to handle closing the dialog.
 * @returns {JSX.Element} The AddTagDialog component.
 */
export default function AddTagDialog({onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState(false);
  const [selectedType, setSelectedType] = useState("department");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * @function handleOnSave
   * @description Handles the save action when adding a new tag.
   * Validates the input and calls the onSave callback if valid.
   * Checks that the name is not empty and does not exceed 30 characters, otherwise sets error states.
   */
  function handleOnSave() {
    if (!nameInput) {
      setNameError(true);
      setErrorMessage("Tag name is required");
      return;
    }

    if (nameInput.length > 40) {
      setNameError(true);
      setErrorMessage("Tag name must be 40 characters or less in length");
      return;
    }

    onSave(selectedType, nameInput);
    handleClose();
  }

  /**
   * @function handleClose
   * @description Handles the close action for the dialog.
   * Resets the input state and calls the onClose callback.
   */
  function handleClose() {
    setNameInput("");
    setNameError(false);
    onClose();
  }

  //Can currently only add names. No links to employees or skills, etc.
  return (
    <Dialog
      slotProps={{
        paper: {
          className: 'dialog-paper'
        }
      }}
      open={isOpen}
      onClose={handleClose}>
      <div className="dialog-container">
      <div className="dialog-header">
        <h3>Add a new tag</h3>
      </div>
      <div className="dialog-actions">
        <div className="dialog-actions-radio-group">
          <label>
            <input
              type={"radio"}
              name={"tagType"}
              value={"department"}
              checked={selectedType === "department"}
              onChange={() => setSelectedType("department")}
            /> Department
          </label>
          <label>
            <input
              type={"radio"}
              name={"tagType"}
              value={"skill"}
              checked={selectedType === "skill"}
              onChange={() => setSelectedType("skill")}
              style={{marginLeft: '12px'}}
            /> Skill
          </label>
        </div>
        <TextField
          autoFocus
          margin="dense"
          label="Tag Name"
          type="text"
          fullWidth
          variant="outlined"
          required={true}
          error={nameError}
          helperText={nameError ? errorMessage : ""}
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <div className="dialog-actions-buttons">
          <button className="cancel-button" onClick={() => handleClose()}>Cancel</button>
          <button className="confirm-button" onClick={() => handleOnSave()}>Add</button>
        </div>
      </div>
      </div>
    </Dialog>
  );
}
