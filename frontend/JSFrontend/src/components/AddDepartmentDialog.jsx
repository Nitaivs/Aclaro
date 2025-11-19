import { Dialog, DialogTitle, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

/**
 * @Component AddDepartmentDialog
 * @description A dialog component for adding a new department.
 * @param onSave Callback function to handle saving the new department.
 * @param isOpen Boolean to control the dialog open state.
 * @param onClose Callback function to handle closing the dialog.
 * @returns {JSX.Element} The AddDepartmentDialog component.
 */

export default function AddDepartmentDialog({ onSave, isOpen, onClose }) {
    const [departmentNameInput, setDepartmentNameInput] = useState("");
    const [nameError, setNameError] = useState(false);

    function handleOnSave() {
        if (!departmentNameInput) {
            setNameError(true);
            return;
        }
        onSave(departmentNameInput);
        handleClose();
    }

    function handleClose() {
        setDepartmentNameInput("");
        setNameError(false);
        onClose();
    }

    //Can currently only add names. No links to employees or skills, etc.
    return (
        <Dialog open={isOpen}>
            <DialogTitle>Add a new department</DialogTitle>
            <div style={{ padding: '0 24px 24px 24px' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Department Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    required={true}
                    error={nameError}
                    helperText={nameError ? "Department name is required" : ""}
                    value={departmentNameInput}
                    onChange={(e) => setDepartmentNameInput(e.target.value)}
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