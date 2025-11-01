import {Link} from 'react-router';
import {useParams} from "react-router";
import {use} from "react";
import TaskCard from "./TaskCard.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {useState} from "react";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import EditProcessDetailsDialog from "./EditProcessDetailsDialog.jsx";


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

  function handleUpdateProcess(newName, newDescription) {
    updateProcess(parsedProcessId, {
      processName: newName || foundProcess.processName,
      processDescription: newDescription || foundProcess.processDescription
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
      <button onClick={() => addTask(parsedProcessId, "New Task", "Task Description")}>
        Add Task
      </button>

      <ul>
        {foundProcess.taskIds.map((taskId) => {
          const task = tasks.find(t => t.taskId === taskId);
          if (!task) return null;
          return (
            <li key={task.taskId}>
              <TaskCard
                processId={parsedProcessId}
                taskId={task.taskId}
                taskName={task.taskName}
                taskDescription={task.taskDescription}
              />
              <button onClick={() => deleteTask(task.taskId)}>delete</button>
            </li>
          )
        })}
      </ul>

      <button onClick={() => setIsDialogOpen(true)}>Show Process Details</button>

      <EditProcessDetailsDialog
        currentName={foundProcess.processName}
        currentDescription={foundProcess.processDescription}
        onSave={handleUpdateProcess}
        isOpen={isDialogOpen}
      />
    </div>
  )
}
