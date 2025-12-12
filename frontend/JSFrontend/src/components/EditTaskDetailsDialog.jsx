import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider, Typography, Box, Chip
} from '@mui/material';
import {useContext, useEffect, useState} from 'react';
import {TagContext} from "../Context/TagContext/TagContext.jsx";
import '../style/Dialog.css'

/**
 * @component EditTaskDetailsDialog
 * @description A dialog component for editing the details of a task.
 * @param {string} currentName - The current name of the task.
 * @param {string} currentDescription - The current description of the task.
 * @param {Object} currentDepartment - The current department associated with the task.
 * @param {Array<Object>} currentSkills - The current skills associated with the task.
 * @param {function} onSave - Function to call when saving the updated details.
 * @param {boolean} isOpen - Boolean indicating if the dialog is open.
 * @param {function} onClose - Function to call when closing the dialog.
 * @returns {JSX.Element} The rendered EditTaskDetailsDialog component.
 */
export default function EditTaskDetailsDialog({
                                                currentName,
                                                currentDescription,
                                                currentDepartment,
                                                currentSkills,
                                                onSave,
                                                isOpen,
                                                onClose
                                              }) {
  const [nameInput, setNameInput] = useState(currentName || "");
  const [descriptionInput, setDescriptionInput] = useState(currentDescription || "");
  const [nameError, setNameError] = useState(false);
  const [defaultName, setDefaultName] = useState(currentName || "")
  const [defaultDescription, setDefaultDescription] = useState(currentDescription || "")
  const [department, setDepartment] = useState(currentDepartment || "");
  // Ensure skillsInput is always an array
  const [skillsInput, setSkillsInput] = useState(currentSkills || []);
  const {departments = []} = useContext(TagContext);
  const {skills = []} = useContext(TagContext);

  useEffect(() => {
    setDefaultName(currentName);
    setDefaultDescription(currentDescription);
    setNameInput(currentName);
    setDescriptionInput(currentDescription);
    setDepartment(currentDepartment || "");
    setSkillsInput(currentSkills || []);
  }, [currentName, currentDescription, currentDepartment, currentSkills]);

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
   * @description Handles the save action for editing task details.
   * Validates the input and calls the onSave function with updated details.
   * Calls onClose to close the dialog after saving.
   */
  function handleOnSave() {
    console.debug("handleOnSave called with:", nameInput, descriptionInput, department, skillsInput);
    if (!nameInput) {
      console.debug("nameInput is required");
      setNameError(true);
      return;
    }

    onSave(nameInput, descriptionInput, department, skillsInput);
    handleOnClose();
  }

  /**
   * @function handleOnClose
   * @description Handles the close action for the dialog.
   * Resets the input state and calls the onClose callback.
   */
  function handleOnClose() {
    setNameInput(currentName || "");
    setDescriptionInput(currentDescription || "");
    setDepartment(currentDepartment || "");
    setSkillsInput(currentSkills || []);
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
          <h3>Edit Task Details</h3>
        </div>
        <div className="dialog-actions">
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            required={true}
            type="text"
            fullWidth
            variant="outlined"
            error={nameError}
            helperText={nameError ? "Task name is required" : ""}
            defaultValue={defaultName || ''}
            onChange={(e) => setNameInput(e.target.value)}
          />

          <TextField
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={defaultDescription || ''}
            onChange={(e) => setDescriptionInput(e.target.value)}
          />

          {/* --- Department Dropdown --- */}
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

          <div className="dialog-actions-skills">

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
          </div>
          <div className="dialog-actions-buttons">
            <button className="cancel-button" onClick={() => handleOnClose()}>Cancel</button>
            <button className="confirm-button" onClick={() => handleOnSave()}>Save</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
