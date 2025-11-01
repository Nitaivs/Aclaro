import {Link} from 'react-router';
import {useParams} from "react-router";
import {use} from "react";
import TaskCard from "./TaskCard.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {useState} from "react";
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";


/**
 * @component ProcessPage
 * @description A page component that displays details for a specific process.
 * Retrieves the processId from the URL parameters and provides navigation back to the dashboard.
 * Allows adding tasks to the process and displays them using TaskCard components.
 * Displays an error message if the processId is invalid.
 * @returns {JSX.Element} The rendered ProcessPage component.
 */
export default function ProcessPage() {
  const {processId} = useParams();
  const {processes, updateProcess} = use(ProcessContext);
  const parsedProcessId = processId ? parseInt(processId) : undefined;
  const foundProcess = processes.find(p => p.processId === parsedProcessId);
  const {tasks, addTask, deleteTask} = use(TaskContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  function handleUpdateProcess() {
    const newName = nameInput || foundProcess.processName;
    const newDescription = descriptionInput || foundProcess.processDescription;
    updateProcess(parsedProcessId, {
      processName: newName,
      processDescription: newDescription
    });
    setIsDialogOpen(false);
  }

  if (!parsedProcessId) {
    return (
      <div>
        <p>Invalid process ID</p>
        <p>{parsedProcessId}</p>
        <Link to="/">
          <button>
            Go to Dashboard
          </button>
        </Link>
      </div>
    )
  }

  if (!foundProcess) {
    return (
      <div>
        <p>Process not found</p>
        <Link to="/">
          <button>
            Go to Dashboard
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/">
        <button>
          Go to Dashboard
        </button>
      </Link>
      <h1>{foundProcess.processName}</h1>
      <p>Process ID: {foundProcess.processId}</p>
      <p>Description: {foundProcess.processDescription}</p>
      <button onClick={() => addTask()}>
        Add Task
      </button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard processId={parsedProcessId} taskId={task.id} taskName={task.name}/>
            <button onClick={() => deleteTask(task.id)}>delete</button>
          </li>
        ))}
      </ul>

      <button onClick={() => setIsDialogOpen(true)}>Show Process Details</button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Process Details</DialogTitle>
        <div style={{padding: '16px'}}>
          <p>Details about process {processId} go here.</p>
          <TextField
            label="Edit Name"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={foundProcess.processName}
            onChange={(e) => setNameInput(e.target.value)}
          />

          <TextField
            label="Edit Description"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={foundProcess.processDescription}
            onChange={(e) => setDescriptionInput(e.target.value)}
          />

          <button onClick={() => {
            handleUpdateProcess();
            setIsDialogOpen(false);
          }}>
            Save
          </button>

          <button onClick={() => setIsDialogOpen(false)}>Close</button>
        </div>
      </Dialog>
    </div>
  )
}
