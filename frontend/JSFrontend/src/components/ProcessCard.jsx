import Card from '@mui/material/Card';
import {Link} from 'react-router';
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {use, useEffect, useState} from "react";
import AreYouSureDialog from "./AreYouSureDialog.jsx";

/**
 * @component ProcessCard
 * @description A card component that displays information about a process.
 * The card serves as a link to the detailed process page.
 * @param props The properties for the ProcessCard component.
 * @param {int} props.id The ID of the process.
 * @returns {JSX.Element} The rendered ProcessCard component.
 */
export default function ProcessCard(props) {
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
        <Card>
          <Link to={`/process/${props.id}`}>
            <h2>{foundProcess.name}</h2>
            <p>{foundProcess.description}</p>
          </Link>
          <AreYouSureDialog
            isOpen={isDialogOpen}
            onCancel={() => setIsDialogOpen(false)}
            title="Delete Process"
            message={`Are you sure you want to delete the process "${foundProcess.name}" and all associated tasks? This action cannot be undone.`}
            onConfirm={() => handleDeleteProcess()}
          />
          <button onClick={() => setIsDialogOpen(true)}>delete</button>
        </Card>
      </div>
    );
  }
}
