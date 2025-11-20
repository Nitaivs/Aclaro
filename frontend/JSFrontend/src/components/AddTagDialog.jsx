import {Dialog, DialogTitle, TextField} from '@mui/material';
import {useState} from 'react';

/**
 * @Component AddDepartmentDialog
 * @description A dialog component for adding a new department.
 * @param onSave Callback function to handle saving the new department.
 * @param isOpen Boolean to control the dialog open state.
 * @param onClose Callback function to handle closing the dialog.
 * @returns {JSX.Element} The AddDepartmentDialog component.
 */

export default function AddTagDialog({onSave, isOpen, onClose}) {
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState(false);
  const [selectedType, setSelectedType] = useState("department");
  const [errorMessage, setErrorMessage] = useState("");

  function handleOnSave() {
    if (!nameInput) {
      setNameError(true);
      setErrorMessage("Tag name is required");
      return;
    }
    onSave(nameInput);
    handleClose();
  }

  function handleClose() {
    setNameInput("");
    setNameError(false);
    onClose();
  }

  //Can currently only add names. No links to employees or skills, etc.
  return (
    <Dialog open={isOpen}>
      <DialogTitle>Add a new tag</DialogTitle>
      <div style={{padding: '0 24px 24px 24px'}}>
        <TextField
          autoFocus
          margin="dense"
          label="Department Name"
          type="text"
          fullWidth
          variant="outlined"
          required={true}
          error={nameError}
          helperText={nameError ? "Tag name is required" : ""}
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button onClick={() => handleOnSave()}>Add</button>
        <button onClick={() => {
          handleClose();
        }}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
