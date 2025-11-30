import {useContext, useState, useMemo} from "react";
import {TagContext} from "../Context/TagContext/TagContext.jsx";
import AddTagDialog from "./AddTagDialog.jsx";
import {
  Alert,
  AlertTitle,
  TextField,
  ListItem,
  ListItemText,
  Box
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import TagItem from "./TagItem.jsx";
import '../style/DetailPanel.css';

export default function TagListPage() {
  const {departments, skills, addDepartment, addSkill} = useContext(TagContext);
  const [isAddTagDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  const filteredDepartments = useMemo(() => {
    const query = (departmentFilter || "").trim().toLowerCase();
    const list = (departments || []);
    if (!query) return list;
    return list.filter(dept => dept.name?.toLowerCase().includes(query));
  }, [departments, departmentFilter]);

  const filteredSkills = useMemo(() => {
    const query = (skillFilter || "").trim().toLowerCase();
    const list = (skills || []);
    if (!query) return list;
    return list.filter(skill => skill.name?.toLowerCase().includes(query));
  }, [skills, skillFilter]);

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
      <AddTagDialog
        isOpen={isAddTagDialogOpen}
        onSave={handleAddTag}
        onClose={() => setIsAddDepartmentDialogOpen(false)}
      />

      <div>
        <div className="detail-container detail-container-small">
          <div className="detail-header">
            <h2>Tag list</h2>
          </div>
          <div className="detail-actions-container">
            <button className="add-button" onClick={() => setIsAddDepartmentDialogOpen(true)}>
              Add Tag
            </button>
            {/* TODO: unify search fields(?)*/}
            <TextField
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              placeholder="Search by name"
              size="small"
              color="white"
              sx={{
                width: '70%',
                mx: 'auto',
                // display: 'block',
                '& .MuiInputBase-root': {
                  backgroundColor: 'white',
                  borderRadius: 3,
                },
              }}
            />
          </div>
        </div>

        <Collapse in={showErrorAlert}>
          <Alert sx={{width: '100%'}} title="Error" severity="error" onClose={() => setShowErrorAlert(false)}>
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
          </Alert>
        </Collapse>

        {/* Side-by-side lists */}
        <Box sx={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
          {/* Departments List */}
          <Box sx={{flex: 1, minWidth: 300}}>
            <div className="detail-container detail-container-small">
              <div className="detail-header">
                <h2>Departments</h2>
              </div>
              <div className="detail-actions-container">
                <TextField
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  placeholder="Search by name"
                  size="small"
                  color="white"
                  sx={{
                    width: '100%',
                    mx: 'auto',
                    display: 'block',
                    '& .MuiInputBase-root': {
                      backgroundColor: 'white',
                      borderRadius: 3,
                    },
                  }}
                />
              </div>
              {filteredDepartments.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No departments found"
                    secondary={departmentFilter ? `No departments match "${departmentFilter}".` : "There are currently no departments to display."}
                  />
                </ListItem>
              ) : (
                <ul>
                  {filteredDepartments.map((dept) => (
                    <li key={`dept-${dept.id}`}>
                      <TagItem
                        type="department"
                        name={dept.name}
                        tagId={dept.id}
                        isEditable={false}
                        isDeletable={true}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Box>
          {/* Skills List */}
          <Box sx={{flex: 1, minWidth: 300}}>
            <div className="detail-container detail-container-small">
              <div className="detail-header">
                <h2>Skills</h2>
              </div>
              <div className="detail-actions-container">
                <TextField
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  placeholder="Search by name"
                  size="small"
                  color="white"
                  sx={{
                    width: '100%',
                    mx: 'auto',
                    display: 'block',
                    '& .MuiInputBase-root': {
                      backgroundColor: 'white',
                      borderRadius: 3,
                    },
                  }}
                />
              </div>
              {filteredSkills.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No skills found"
                    secondary={skillFilter ? `No skills match "${skillFilter}".` : "There are currently no skills to display."}
                  />
                </ListItem>
              ) : (
                <div>
                  <ul>
                    {filteredSkills.map((skill) => (
                      <li key={`skill-${skill.id}`}>
                        <TagItem
                          type="skill"
                          name={skill.name}
                          tagId={skill.id}
                          isEditable={true}
                          isDeletable={true}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Box>
        </Box>
      </div>
    </>
  );
}
