import ProcessCard from "./ProcessCard.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {use, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import '../style/DetailPanel.css'

/**
 * @component ProcessListPage
 * @description A component that displays a list of processes.
 * Users can add new processes and each process is represented by a ProcessCard component.
 * @return {JSX.Element} The rendered ProcessListPage component.
 */
export default function ProcessListPage() {
  const {processes, addProcess} = use(ProcessContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProcessName, setNewProcessName] = useState("");
  const [newProcessDescription, setNewProcessDescription] = useState("");
  const [processNameError, setProcessNameError] = useState(false);

  /**
   * @function handleAddProcess
   * @description Handles the addition of a new process.
   * Validates the input and calls the addProcess function from ProcessContext.
   * Resets the input fields and closes the dialog upon successful addition.
   */
  function handleAddProcess() {
    if (!newProcessName) {
      setProcessNameError(true);
      return;
    }
    addProcess(newProcessName, newProcessDescription);
    setNewProcessName("");
    setNewProcessDescription("");
    setProcessNameError(false);
    setIsDialogOpen(false);
  }

  return (
    <div className={"detail-container"}>
      <div className={'detail-header'}>
        <h2>Processes</h2>
      </div>
      <button onClick={() => setIsDialogOpen(true)}>Add process</button>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add New Process</DialogTitle>
        <div style={{padding: '0 24px 24px 24px'}}>
          <TextField
            autoFocus
            margin="dense"
            label="Process Name"
            type="text"
            fullWidth
            variant="outlined"
            required={true}
            error={processNameError}
            helperText={processNameError ? "Process name is required" : ""}
            value={newProcessName}
            onChange={(e) => setNewProcessName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Process Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newProcessDescription}
            onChange={(e) => setNewProcessDescription(e.target.value)}
          />
          <button onClick={() => handleAddProcess()}>Add</button>
          <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
        </div>
      </Dialog>
      <ul>
        {processes.map((process) => (
          <li key={process.id}>
            <ProcessCard id={process.id}/>
          </li>
        ))}
      </ul>
    </div>
  )
}
