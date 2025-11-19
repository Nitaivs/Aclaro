import {useContext, useState} from "react";
import {TagContext} from "../Context/TagContext/TagContext.jsx";
import AddDepartmentDialog from "./AddDepartmentDialog.jsx";
import {Link} from "react-router";
import {
  Alert,
  AlertTitle,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton
} from "@mui/material";
import Collapse from "@mui/material/Collapse";


export default function TagListPage() {
  const {departments, addDepartment, deleteDepartmentById} = useContext(TagContext);
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterString, setFilterString] = useState("");
  const [removeMode, setRemoveMode] = useState(false);

  const filtered = (departments || []).filter(dep => `${dep?.name || ''}`.toLowerCase().includes(filterString.trim().toLowerCase()));

  /**
   * @function handleAddDepartment
   * @description Handles the addition of a new department.
   * Calls the addDepartment function from TagContext and manages error handling.
   * @param name - The name of the new department.
   * @returns {Promise<void>} A promise that resolves when the department is added or an error occurs.
   */
  async function handleAddDepartment(name) {
    try {
      await addDepartment(name);
    } catch (error) {
      console.error("Error adding employee:", error);
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
        Add department
      </button>
      <button onClick={() => setRemoveMode(!removeMode)}>
        {removeMode ? "Exit" : "Remove Departments"}
      </button>

      <AddDepartmentDialog
        isOpen={isAddDepartmentDialogOpen}
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
                primary="No departments found"
                secondary={filterString ? `No departments match "${filterString}".` : "There are currently no department to display."}
              />
            </ListItem>
          ) : (
            filtered.map((dep, idx) => (
              <div key={dep.id ?? idx}>
                <Link to={`/departments/${dep.id}`}>
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
                            handleDeleteDepartment(dep.id);
                          }}
                        >
                          X
                        </IconButton>
                      ) : null
                    }
                  />
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar></Avatar>
                    </ListItemAvatar>
                    <p>
                      {dep.name}
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
