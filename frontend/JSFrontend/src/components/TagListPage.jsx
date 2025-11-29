import {useContext, useState, useMemo} from "react";
import {TagContext} from "../Context/TagContext/TagContext.jsx";
import AddTagDialog from "./AddTagDialog.jsx";
import {
  Alert,
  AlertTitle,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import TagItem from "./TagItem.jsx";
import '../style/DetailPanel.css'


export default function TagListPage() {
  const {departments, skills, addDepartment, addSkill} = useContext(TagContext);
  const [isAddTagDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterString, setFilterString] = useState("");

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
   * @function handleAddTag
   * @description Handles the addition of a new department.
   * Calls the addDepartment function from TagContext and manages error handling.
   * @param {string} type - The type of tag to add ("department" or "skill").
   * @param {string} name - The name of the new department.
   * @returns {Promise<void>} A promise that resolves when the department is added or an error occurs.
   */
  async function handleAddTag(type, name) {
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
    <>
      <div className="detail-container">
        <div className="detail-header">
          <h2>Tag list</h2>
        </div>
        <div className="detail-actions-container">
          <button style={{marginBottom: '10px'}} onClick={() => setIsAddDepartmentDialogOpen(true)}>
            Add tag
          </button>
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
                borderRadius: 3,
              },
            }}
          />
        </div>

        <Collapse in={showErrorAlert}>
          <Alert sx={{width: '100%'}} title="Error" severity="error" onClose={() => setShowErrorAlert(false)}>
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
          </Alert>
        </Collapse>
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
                  <ListItem alignItems="flex-start">
                    <TagItem
                      type={tag.type}
                      name={tag.name}
                      tagId={tag.id}
                      isEditable={tag.type === "skill"}
                      isDeletable={true}
                    />
                  </ListItem>
                  {idx < filtered.length - 1 && <Divider component="li"/>}
                </div>
              ))
            )}
          </List>
      </div>
      <AddTagDialog
        isOpen={isAddTagDialogOpen}
        onSave={handleAddTag}
        onClose={() => setIsAddDepartmentDialogOpen(false)}
      />
    </>
  );
}
