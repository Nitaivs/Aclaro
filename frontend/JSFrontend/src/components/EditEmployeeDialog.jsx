import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { TagContext } from "../Context/TagContext/TagContext.jsx";

export default function EditEmployeeDialog({ currentFirstName, currentLastName, onSave, isOpen, onClose, currentDepartment }) {
    const [firstNameInput, setFirstNameInput] = useState(currentFirstName || "");
    const [lastNameInput, setLastNameInput] = useState(currentLastName || "");
    const [department, setDepartment] = useState(currentDepartment || "");
    const [nameError, setNameError] = useState(false);
    const { departments = [] } = useContext(TagContext);

    useEffect(() => {
        setFirstNameInput(currentFirstName || "");
        setLastNameInput(currentLastName || "");
        setDepartment(currentDepartment || "");
    }, [currentFirstName, currentLastName, currentDepartment]);

    function handleOnSave() {
        if (firstNameInput === currentFirstName && lastNameInput === currentLastName) {
            handleClose();
            return;
        }
        if (!firstNameInput || !lastNameInput) {
            setNameError(true);
            return;
        }
        // NOTE: onSave now receives departmentId as the third argument
        onSave(firstNameInput, lastNameInput, department);
        handleClose();
    }

    function handleClose() {
        // reset local inputs to current props so dialog shows original values next time it's opened
        setFirstNameInput(currentFirstName || "");
        setLastNameInput(currentLastName || "");
        setDepartment(currentDepartment || "");
        setNameError(false);
        onClose();
    }

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="First Name"
                    required
                    type="text"
                    fullWidth
                    variant="outlined"
                    error={nameError}
                    helperText={nameError ? "First name is required" : ""}
                    value={firstNameInput}
                    onChange={(e) => setFirstNameInput(e.target.value)}
                />

                <TextField
                    margin="dense"
                    label="Last Name"
                    required
                    type="text"
                    fullWidth
                    variant="outlined"
                    error={nameError}
                    helperText={nameError ? "Last name is required" : ""}
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel id="department-select-label">Department</InputLabel>
                    <Select
                        labelId="department-select-label"
                        label="Department"
                        value={department?.id || ""}
                        onChange={(e) => {
                            const selectedDept = departments.find(dept => dept.id === e.target.value);
                            setDepartment(selectedDept || "");
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                                {dept.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <Button variant="contained" color="primary" onClick={handleOnSave}>Save</Button>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
