import {Link} from 'react-router';
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {use, useEffect, useState} from "react";
import EditProcessDetailsDialog from "./EditProcessDetailsDialog.jsx";
import AreYouSureDialog from "./AreYouSureDialog.jsx";
import {IconButton} from "@mui/material";
import EditIcon from '../assets/edit.svg';
import DeleteIcon from '../assets/delete.svg';
import '../style/DetailPanel.css'
import '../style/ItemCard.css'

/**
 * @component ProcessItem
 * @description A component that displays information about a single process.
 * Shows the process ID, name, and description, and provides options to edit or delete the process.
 * Also serves as a clickable link to the detailed process page.
 * @param {Object} props The properties for the ProcessItem component.
 * @param {Number} props.id The ID of the process.
 * @returns {JSX.Element} The rendered ProcessItem component.
 */
export default function ProcessItem(props) {
  const {processes, updateProcess, deleteProcess} = use(ProcessContext);
  const foundProcess = processes.find(p => p.id === props.id);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    console.log("Processes updated:", processes);
  }, [processes]);

  /**
   * @function handleUpdateProcess
   * @description Handles the update of process details.
   * Calls the updateProcess function from ProcessContext with the new name and description.
   * @param newName The new name for the process. May be undefined, in which case the current name is retained.
   * @param newDescription The new description for the process.
   * May be undefined, in which case the current description is retained.
   */
  function handleUpdateProcess(newName, newDescription) {
    try {
      console.log("updating process:", foundProcess.id, newName, newDescription);
      updateProcess(foundProcess.id, {
        name: newName || foundProcess.name,
        description: newDescription || foundProcess.description,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @function handleDeleteProcess
   * @description Handles the deletion of the process.
   * Calls the deleteProcess function from ProcessContext.
   */
  function handleDeleteProcess() {
    try {
      deleteProcess(foundProcess.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      //TODO: add error alert to UI
      console.error("Error deleting process:", error);
    }
  }

  if (!foundProcess) {
    return (
      <div>
        <p>Process not found</p>
      </div>
    );
  } else {
    return (
      <div>
        <div className="item-card">
          <Link to={`/process/${props.id}`} className="item-card-content">
            <div className="item-card-info">
              <h4 style={{color: 'red'}}>Process</h4>
              <span>|</span>
              <h4>{foundProcess.name}</h4>
            </div>
            <div className={"item-card-info"}>
              {foundProcess.description && <p>Description: {foundProcess.description}</p>}
            </div>
          </Link>
          <div className={"item-card-actions"}>
            <IconButton
              onClick={() => setIsEditDialogOpen(true)}
              aria-label="edit"
              size="small"
            >
              <img src={EditIcon} alt="Edit" width={30} height={30}/>
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <img src={DeleteIcon} alt="Delete" width={30} height={30}/>
            </IconButton>
          </div>
        </div>
        <EditProcessDetailsDialog
          currentName={foundProcess.name}
          currentDescription={foundProcess.description}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleUpdateProcess}
        />
        <AreYouSureDialog
          isOpen={isDeleteDialogOpen}
          onCancel={() => setIsDeleteDialogOpen(false)}
          title="Delete Process"
          message={`Are you sure you want to delete the process "${foundProcess.name}" and all associated tasks? This action cannot be undone.`}
          onConfirm={() => handleDeleteProcess()}
        />
      </div>
    );
  }
}
