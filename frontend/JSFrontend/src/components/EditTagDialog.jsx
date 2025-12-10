import {useState, useEffect} from 'react';
import {Dialog, TextField} from '@mui/material';
import '../style/Dialog.css'

/**
 * @Component EditTagDialog
 * @description A dialog component for editing an existing tag.
 * @param {String} currentName The current name of the tag to be edited.
 * @param {function} onSave Callback function to handle saving the edited tag.
 * @param {boolean} isOpen Boolean to control the dialog open state.
 * @param {function} onClose Callback function to handle closing the dialog.
 * @returns {JSX.Element} The EditTagDialog component.
 */
export default function EditTagDialog({currentName, onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState(currentName || "");
  const [nameError, setNameError] = useState(false);
  const [defaultName, setDefaultName] = useState(currentName || "")
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDefaultName(currentName);
    setNameInput(currentName);
  }, [currentName]);

  /**
   * @function handleOnSave
   * @description Handles the save action when editing a tag.
   * Validates the input and calls the onSave callback if valid.
   */
  function handleOnSave() {
    if (nameInput === currentName) {
      onClose();
      return;
    }
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
    setNameError(false);
    onSave(nameInput);
    handleOnClose();
  }

  /**
   * @function handleOnClose
   * @description Handles the close action for the dialog.
   * Resets the input state and calls the onClose callback.
   */
  function handleOnClose() {
    setNameInput(currentName || "");
    setNameError(false);
    onClose();
  }

  return (
    <Dialog
      slotProps={{
        paper: {
          className: "dialog-paper",
        }
      }}
      open={isOpen}
      onClose={handleOnClose}>
      <div className="dialog-container">
        <div className="dialog-header">
          <h3>Edit Tag</h3>
        </div>
        <div className="dialog-actions">
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
            defaultValue={defaultName}
            onChange={(e) => setNameInput(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'white',
                borderRadius: 3,
              },
            }}
          />
          <div className="dialog-actions-buttons">
            <button className="cancel-button" onClick={handleOnClose}>
              Cancel
            </button>
            <button className="confirm-button" onClick={handleOnSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
