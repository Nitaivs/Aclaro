import {useContext, useState, useMemo, useEffect} from "react";
import {TagContext} from "../Context/TagContext/TagContext.jsx";
import AddTagDialog from "./AddTagDialog.jsx";
import {Link} from "react-router";
import {
  Alert,
  AlertTitle,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from "@mui/material";
import Collapse from "@mui/material/Collapse";


export default function TagListPage() {
  const {departments, skills, addDepartment, addSkill, deleteDepartmentById} = useContext(TagContext);
  const [isAddTagDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterString, setFilterString] = useState("");
  const [removeMode, setRemoveMode] = useState(false);

  //Combine departments and skills into a single list with type information
  const combinedTags = useMemo(() => {
    const departmentsWithType = (departments || []).map(dept => ({...dept, type: 'department'}));
    const skillsWithType = (skills || []).map(skill => ({...skill, type: 'skill'}));
    return [...departmentsWithType, ...skillsWithType];
  }, [departments, skills]);

  const filtered = useMemo(() => {
    const query = (filterString || "").trim().toLowerCase();
    return combinedTags.filter(tag => {
      // Determine name based on tag type. If type is 'department', use departmentName, else use skillName.
      // If neither exists, default to an empty string.
      const name = (tag.type === 'department' ? tag.departmentName : tag.skillName) || "";
      return name.toLowerCase().includes(query);
    });
  }, [combinedTags, filterString]);

  /**
   * @function handleAddDepartment
   * @description Handles the addition of a new department.
   * Calls the addDepartment function from TagContext and manages error handling.
   * @param name - The name of the new department.
   * @returns {Promise<void>} A promise that resolves when the department is added or an error occurs.
   */
  async function handleAddDepartment(type, name) {
    try {
      if (type === "department") {
        await addDepartment(name);
      } else if (type === "skill") {
        await addSkill(name);
      } else {
        setErrorMessage("Error adding tag: Unknown tag type: " + type);
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error("Error adding tag: ", error);
      setErrorMessage(error.message)
      setShowErrorAlert(true);
    }
  }

  /**
   * @function handleDeleteDepartment
   * @description Handles the deletion of a department.
   * Calls the deleteDepartmentById function from TagContext and manages error handling.
   * @param {number} id - The ID of the department to delete.
   * @returns {Promise<void>} A promise that resolves when the department is deleted or an error occurs.
   */
  async function handleDeleteDepartment(id) {
    try {
      await deleteDepartmentById(id);
    } catch (error) {
      console.error("Error deleting employee:", error);
      setErrorMessage(error.message || String(error));
      setShowErrorAlert(true);
    }
  }

  return (
    <div>
      <Link to={"/"}>
        <button>
          Return to dashboard
        </button>
      </Link>

      <h1>Tag list</h1>
      <button onClick={() => setIsAddDepartmentDialogOpen(true)}>
        Add tag
      </button>
      <button onClick={() => setRemoveMode(!removeMode)}>
        {removeMode ? "Exit" : "Remove Departments"}
      </button>

      <AddTagDialog
        isOpen={isAddTagDialogOpen}
        onSave={handleAddDepartment}
        onClose={() => setIsAddDepartmentDialogOpen(false)}
      />

      <Collapse in={showErrorAlert}>
        <Alert sx={{width: '100%'}} title="Error" severity="error" onClose={() => setShowErrorAlert(false)}>
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      </Collapse>
      {/* Search Field */}
      <TextField
        value={filterString}
        onChange={(e) => setFilterString(e.target.value)}
        placeholder="Search by name"
        fullWidth
        size="small"
        color="white"
        sx={{
          mb: 1,
          '& .MuiInputBase-root': {
            backgroundColor: 'white',
            borderRadius: 1,
          },
        }}
      />

      <Paper variant="outlined" sx={{p: 1}}>
        <List>
          {filtered.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No tags found"
                secondary={filterString ? `No tags match "${filterString}".` : "There are currently no tags to display."}
              />
            </ListItem>
          ) : (
            filtered.map((tag, idx) => (
              <div key={tag.id ?? idx}>
                <Link to={`/tags/${tag.type}/${tag.departmentId || tag.skillId}`} style={{textDecoration: 'none', color: 'inherit'}}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      removeMode ? (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="error"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteDepartment(tag.id);
                          }}
                        >
                          X
                        </IconButton>
                      ) : null
                    }
                  />
                  <ListItem alignItems="flex-start">
                    <p>
                      {tag.departmentName || tag.skillName}
                    </p>
                  </ListItem>
                  {idx < filtered.length - 1 && <Divider component="li"/>}
                </Link>
              </div>
            ))
          )}
        </List>
      </Paper>
    </div>
  );
}
