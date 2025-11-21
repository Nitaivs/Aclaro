import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

/**
 *
 * @Component EditDepartmentDialog
 * @description A dialog component for editing department details.
 * @param currentName The current name of the department to be edited.
 * @param onSave Callback function to handle saving the updated department details.
 * @param isOpen Boolean indicating whether the dialog is open.
 * @param onClose Callback function to handle closing the dialog.
 * @returns {JSX.Element} The EditDepartmentDialog component.
 */
export default function EditDepartmentDialog({currentName, onSave, isOpen, onClose}) {
    const [nameInput, setNameInput] = useState(currentName || "");
    //TODO: error currently does not distinguish between first and last name, fix later
    const [nameError, setNameError] = useState(false);
    const [defaultName, setDefaultName] = useState(currentName || "")

    useEffect(() => {
        setDefaultName(currentName);
        setNameInput(currentName);
    }, [currentName]);

    /**
     * @function handleOnSave
     * @description Handles the save action for editing department details.
     * Validates the input and calls the onSave function with updated details.
     * Calls onClose to close the dialog after saving.
     */
    function handleOnSave() {
        if (nameInput === currentName) {
            handleClose()
            return;
        }
        if (!nameInput) {
            setNameError(true);
            return;
        }
        onSave(nameInput);
        handleClose()
    }

    /**
     * @function handleClose
     * @description Handles the close action for the dialog.
     * Resets the input fields and error state, then calls the onClose callback.
     */
    function handleClose() {
        // setFirstNameInput(currentFirstName || "");
        // setLastNameInput(currentLastName || "");
        setNameError(false);
        onClose();
    }

    return (
        <Dialog open={isOpen}>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name of department"
                    required={true}
                    type="text"
                    fullWidth
                    variant="outlined"
                    error={nameError}
                    helperText={nameError ? "First name is required" : ""}
                    defaultValue={defaultName || ''}
                    onChange={(e) => setNameInput(e.target.value)}
                />
                <button onClick={() => {
                    handleOnSave();
                }}>
                    Save
                </button>

                <button onClick={() => {
                    handleClose();
                }}>
                    Cancel
                </button>
            </DialogContent>
        </Dialog>
    );
}