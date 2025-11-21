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
import TagItem from "./TagItem.jsx";

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
      return tag.name.toLowerCase().includes(query);
    });
  }, [combinedTags, filterString]);

  /**
   * @function handleAddDepartment
   * @description Handles the addition of a new department.
   * Calls the addDepartment function from TagContext and manages error handling.
   * @param {string} type - The type of tag to add ("department" or "skill").
   * @param {string} name - The name of the new department.
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

  return (
    <div>
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
              <div key={`${tag.type}-${tag.id}`}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="edit"
                    >
                    </IconButton>
                  }
                />
                <ListItem alignItems="flex-start">
                  <TagItem type={tag.type}
                           name={tag.name}
                           tagId={tag.id}
                           isEditable={tag.type === "skill"}
                           isDeletable={true}/>
                </ListItem>
                {idx < filtered.length - 1 && <Divider component="li"/>}
              </div>
            ))
          )}
        </List>
      </Paper>
    </div>
  );
}
