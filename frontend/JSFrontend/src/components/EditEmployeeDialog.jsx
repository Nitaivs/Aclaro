import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Chip,
  Box,
  Typography,
  Divider
} from '@mui/material';
import {useState, useEffect, useContext} from 'react';
import {TagContext} from "../Context/TagContext/TagContext.jsx";

/**
 * @component EditEmployeeDialog
 * @description A dialog component for editing an employee's details, including first name, last name, department, and skills.
 * @param {String} currentFirstName - The current first name of the employee.
 * @param {String} currentLastName - The current last name of the employee.
 * @param {Object|null} currentDepartment - The current department of the employee. May be null if there is no department assigned.
 * @param {Array<Object>} currentSkills - The current skills of the employee.
 * @param {function} onSave - Function to call when saving the updated employee details.
 * @param {boolean} isOpen - Boolean indicating if the dialog is open.
 * @param {function} onClose - Function to call when closing the dialog.
 * @returns {React.JSX.Element} The rendered EditEmployeeDialog component.
 */
export default function EditEmployeeDialog({
                                             currentFirstName,
                                             currentLastName,
                                             currentDepartment,
                                             currentSkills,
                                             onSave,
                                             isOpen,
                                             onClose
                                           }) {
  const [firstNameInput, setFirstNameInput] = useState(currentFirstName || "");
  const [lastNameInput, setLastNameInput] = useState(currentLastName || "");
  const [department, setDepartment] = useState(currentDepartment || "");
  // Ensure skillsInput is always an array
  const [skillsInput, setSkillsInput] = useState(currentSkills || []);

  const [nameError, setNameError] = useState(false);

  const {departments = []} = useContext(TagContext);
  const {skills = []} = useContext(TagContext);

  useEffect(() => {
    setFirstNameInput(currentFirstName || "");
    setLastNameInput(currentLastName || "");
    setDepartment(currentDepartment || "");
    setSkillsInput(currentSkills || []);
  }, [currentFirstName, currentLastName, currentDepartment, currentSkills]);

  // -- Logic for Skills --

  /**
   * @function handleRemoveSkill
   * @description Removes a skill from the employee's skills array based on the provided skill ID.
   * @param {number} skillIdToRemove The ID of the skill to be removed. Expected to be an integer.
   */
  function handleRemoveSkill(skillIdToRemove) {
    setSkillsInput(prev => prev.filter(skill => skill.id !== skillIdToRemove));
  }

  /**
   * @function handleAddSkill
   * @description Adds a skill to the employee's skills array if it's not already present.
   * @param {Object} skillToAdd The skill object to be added.
   */
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

  /**
   * @function handleOnSave
   * @description Handles the save action when editing an employee.
   * Validates the input and calls the onSave callback if valid. Afterwards, calls handleClose to reset and close the dialog.
   */
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

  /**
   * @function handleClose
   * @description Handles the close action for the dialog.
   * Resets the input fields and error state, then calls the onClose callback.
   */
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

        <Divider sx={{my: 2}}/>

        {/* --- Skills Section --- */}

        {/* Assigned Skills (Chips with X to delete) */}
        <Typography variant="subtitle1" gutterBottom>
          Assigned Skills:
        </Typography>
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: '40px', mb: 2}}>
          {skillsInput.length === 0 && (
            <Typography variant="body2" color="text.secondary" style={{fontStyle: 'italic'}}>
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
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
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

        <div style={{display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end'}}>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleOnSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
