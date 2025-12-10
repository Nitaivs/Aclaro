import {use, useState} from "react";
import {TagContext} from "../Context/TagContext/TagContext.jsx";
import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';
import {IconButton} from "@mui/material";
import EditTagDialog from "./EditTagDialog.jsx";
import AreYouSureDialog from "./AreYouSureDialog.jsx";
import '../style/TagItem.css'

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

  let foundTag = null;
  if (type === 'department') {
    foundTag = departments.find(d => d.id === tagId);
  } else if (type === 'skill') {
    foundTag = skills.find(s => s.id === tagId);
  }

  /**
   * @function handleUpdateTag
   * @description Handles the update of a tag's name.
   * Calls the updateTag function from TagContext and manages error handling.
   * @param newName - The new name for the tag.
   * @returns {Promise<void>} A promise that resolves when the tag is updated or an error occurs.
   */
  async function handleUpdateTag(newName) {
    await updateTag(foundTag.id, type, {name: newName});
  }

  /**
   * @function handleDeleteTag
   * @description Handles the deletion of a tag.
   * Calls the deleteTagById function from TagContext and manages error handling.
   * @returns {Promise<void>} A promise that resolves when the tag is deleted or an error occurs.
   */
  async function handleDeleteTag() {
    await deleteTagById(foundTag.id, type);
  }

  if (!foundTag) {
    return (
      <span>Unknown Tag (ID: {tagId})</span>
    );
  }

  return (
    <>
      <div className="tag-item-container">
      <span className="tag-item-name">
      {foundTag.name}
      </span>
        <div className="tag-item-actions">
          {isEditable && (
            <IconButton
              edge="end"
              aria-label={`edit-${foundTag.id}`}
              size="small"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <img src={editIcon} alt={"tag edit button"} height={30} width={30}/>
            </IconButton>
          )}
          {isDeletable && (
            <IconButton
              edge="end"
              aria-label={`delete-${foundTag.id}`}
              size="small"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <img src={deleteIcon} alt={"tag delete button"} height={30} width={30}/>
            </IconButton>
          )}
        </div>
      </div>
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
    </>
  );
}
