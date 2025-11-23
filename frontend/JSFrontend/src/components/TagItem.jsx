import {use, useState} from "react";
import {TagContext} from "../Context/TagContext/TagContext.jsx";
import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';
import {IconButton} from "@mui/material";
import EditTagDialog from "./EditTagDialog.jsx";
import AreYouSureDialog from "./AreYouSureDialog.jsx";
import ErrorDialog from "./ErrorDialog.jsx";

/**
 * @component TagItem
 * @description A component that displays a tag (department or skill) with optional edit functionality.
 * @param type The type of tag ('department' or 'skill')
 * @param tagId The ID of the tag to display
 * @param isEditable Whether the tag is editable (default: false)
 * @param isDeletable Whether the tag is deletable (default: false)
 * @returns {JSX.Element} The rendered TagItem component.
 */
export default function TagItem({type, tagId, isEditable = false, isDeletable = false}) {
  const {departments, skills, updateTag, deleteTagById} = use(TagContext);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let foundTag = null;
  if (type === 'department') {
    foundTag = departments.find(d => d.id === tagId);
  } else if (type === 'skill') {
    foundTag = skills.find(s => s.id === tagId);
  }

  async function handleUpdateTag(newName) {
    try {
      await updateTag(foundTag.id, type, {name: newName});
    } catch (error) {
      console.error("Error updating tag:", error);
      setErrorMessage(error.message);
      setShowErrorDialog(true);
    }
  }

  async function handleDeleteTag() {
    try {
      await deleteTagById(foundTag.id, type);
    } catch (error) {
      console.error("Error deleting tag:", error);
      setErrorMessage(error.message);
      setShowErrorDialog(true);
    }
  }

  if (!foundTag) {
    return (
      <span>Unknown Tag (ID: {tagId})</span>
    );
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
      <span style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
      {foundTag.name}
      </span>
      {isEditable &&
        <IconButton
          edge="end"
          aria-label={`edit-${foundTag.id}`}
          size="small"
          onClick={() => setIsEditDialogOpen(true)}
          style={{marginLeft: 'auto'}}
        >
          <img src={editIcon} alt={"tag edit button"} height={30} width={30}/>
        </IconButton>}
      {isDeletable &&
        <IconButton
          edge="end"
          aria-label={`delete-${foundTag.id}`}
          size="small"
          style={{marginLeft: 'auto'}}
          onClick={() => {
            setIsDeleteDialogOpen(true);
          }}
        >
          <img src={deleteIcon} alt={"tag delete button"} height={30} width={30}/>
        </IconButton>
      }
      <EditTagDialog
        currentName={foundTag.name}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUpdateTag}
      />
      <AreYouSureDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={"Delete Tag"}
        message={`Are you sure you want to delete the tag "${foundTag.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteTag}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Error"
        message={errorMessage}
      />
    </div>
  );
}
