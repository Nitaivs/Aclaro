import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, InputLabel, FormControl, Button, Chip, Box, Typography, Divider } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { TagContext } from "../Context/TagContext/TagContext.jsx";
//import AddTagDialog from "./AddTagDialog.jsx";
//import handleAddTag from "./TagListPage.jsx";

export default function EditEmployeeDialog({ currentFirstName, currentLastName, currentDepartment, currentSkills, onSave, isOpen, onClose }) {
    const [firstNameInput, setFirstNameInput] = useState(currentFirstName || "");
    const [lastNameInput, setLastNameInput] = useState(currentLastName || "");
    const [department, setDepartment] = useState(currentDepartment || "");
    // Ensure skillsInput is always an array
    const [skillsInput, setSkillsInput] = useState(currentSkills || []);
    //TODO: Implemnt this later if needed
    //const [isAddTagDialogOpen, setIsAddTagDialogOpen] = useState(false);

    const [nameError, setNameError] = useState(false);

    const { departments = [] } = useContext(TagContext);
    const { skills = [] } = useContext(TagContext);

    useEffect(() => {
        setFirstNameInput(currentFirstName || "");
        setLastNameInput(currentLastName || "");
        setDepartment(currentDepartment || "");
        setSkillsInput(currentSkills || []);
    }, [currentFirstName, currentLastName, currentDepartment, currentSkills]);

    // -- Logic for Skills --

    // Remove a skill from the employee (Triggered by X button)
    function handleRemoveSkill(skillIdToRemove) {
        setSkillsInput(prev => prev.filter(skill => skill.id !== skillIdToRemove));
    }

    // Add a skill to the employee (Triggered by clicking available skill)
    function handleAddSkill(skillToAdd) {
        // Prevent duplicates
        if (!skillsInput.some(s => s.id === skillToAdd.id)) {
            setSkillsInput(prev => [...prev, skillToAdd]);
        }
    }

    // Filter global skills to show only those NOT currently assigned to the employee
    const availableSkills = skills.filter(
        globalSkill => !skillsInput.some(empSkill => empSkill.id === globalSkill.id)
    );

    function handleOnSave() {
        // Check if inputs are empty
        if (!firstNameInput || !lastNameInput) {
            setNameError(true);
            return;
        }

        // Pass all data back to parent, including the updated skills array
        onSave(firstNameInput, lastNameInput, department, skillsInput);
        handleClose();
    }

    function handleClose() {
        setFirstNameInput(currentFirstName || "");
        setLastNameInput(currentLastName || "");
        setDepartment(currentDepartment || "");
        setSkillsInput(currentSkills || []);
        setNameError(false);
        onClose();
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogContent>
                {/* --- Basic Info --- */}
                <TextField
                    autoFocus
                    margin="dense"
                    label="First Name"
                    required
                    fullWidth
                    variant="outlined"
                    error={nameError}
                    value={firstNameInput}
                    onChange={(e) => setFirstNameInput(e.target.value)}
                />

                <TextField
                    margin="dense"
                    label="Last Name"
                    required
                    fullWidth
                    variant="outlined"
                    error={nameError}
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="department-select-label">Department</InputLabel>
                    <Select
                        labelId="department-select-label"
                        value={department?.id || ""}
                        label="Department"
                        onChange={(e) => {
                            const selectedDept = departments.find(dept => dept.id === e.target.value);
                            setDepartment(selectedDept || "");
                        }}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                                {dept.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Divider sx={{ my: 2 }} />

                {/* --- Skills Section --- */}

                {/* Assigned Skills (Chips with X to delete) */}
                <Typography variant="subtitle1" gutterBottom>
                    Assigned Skills:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: '40px', mb: 2 }}>
                    {skillsInput.length === 0 && (
                        <Typography variant="body2" color="text.secondary" style={{ fontStyle: 'italic' }}>
                            No skills assigned.
                        </Typography>
                    )}
                    {skillsInput.map((skill) => (
                        <Chip
                            key={skill.id}
                            label={skill.name}
                            onDelete={() => handleRemoveSkill(skill.id)} // This adds the X button
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                </Box>

                {/* Available Skills (Clickable buttons to add) */}
                <Typography variant="subtitle1" gutterBottom>
                    Add Skills:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {availableSkills.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            All available skills assigned.
                        </Typography>
                    )}
                    {availableSkills.map((skill) => (
                        <Chip
                            key={skill.id}
                            label={`+ ${skill.name}`}
                            onClick={() => handleAddSkill(skill)} // Click to add
                            variant="filled"
                            clickable
                        />
                    ))}
                </Box>

                <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleOnSave}>Save</Button>
                </div>
            </DialogContent>
            {/*
            <button onClick={() => setIsAddTagDialogOpen(true)}>
                Add tag
            </button>

            <AddTagDialog
                    isOpen={isAddTagDialogOpen}
                    onSave={handleAddTag}
                    onClose={() => setIsAddTagDialogOpen(false)}
            /> //TODO: implement this later if needed */}
        </Dialog>
    );
}
