import {Link} from 'react-router';
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {use, useEffect, useState} from "react";
import AreYouSureDialog from "./AreYouSureDialog.jsx";
import '../style/ProcessItem.css'
import {IconButton} from "@mui/material";
import EditIcon from '../assets/edit.svg';
import DeleteIcon from '../assets/delete.svg';
import '../style/DetailPanel.css'

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
  const {processes, deleteProcess} = use(ProcessContext);
  const foundProcess = processes.find(p => p.id === props.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    console.log("Processes updated:", processes);
  }, [processes]);

  function handleDeleteProcess() {
    try {
      deleteProcess(props.id);
      setIsDialogOpen(false);
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
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <Link to={`/process/${props.id}`}>
            <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
              <h4 style={{color: 'red'}}>Process {foundProcess.id}</h4>
              <span>|</span>
              <h4>{foundProcess.name}</h4>
            </div>
            {foundProcess.description &&
              <p>Description: {foundProcess.description}</p>
            }

          </Link>
          <div className={"detail-actions"}>
            <IconButton
              to={`/process/${props.id}`}
              aria-label="edit"
              size="small"
            >
              <img src={EditIcon} alt="Edit" width={30} height={30}/>
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => setIsDialogOpen(true)}
            >
              <img src={DeleteIcon} alt="Delete" width={30} height={30}/>
            </IconButton>
          </div>
        </div>
        <AreYouSureDialog
          isOpen={isDialogOpen}
          onCancel={() => setIsDialogOpen(false)}
          title="Delete Process"
          message={`Are you sure you want to delete the process "${foundProcess.name}" and all associated tasks? This action cannot be undone.`}
          onConfirm={() => handleDeleteProcess()}
        />
        <button onClick={() => setIsDialogOpen(true)}>delete</button>
      </div>
    );
  }
}
