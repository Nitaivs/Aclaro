import {Link} from 'react-router';
import {useParams} from "react-router";
import {use} from "react";
import TaskCard from "./TaskCard.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {useState} from "react";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import EditProcessDetailsDialog from "./EditProcessDetailsDialog.jsx";
import AddTaskDialog from "./AddTaskDialog.jsx";

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
  const {processes, updateProcess, fetchProcessById} = use(ProcessContext);
  const parsedProcessId = processId ? parseInt(processId) : undefined;
  const foundProcess = processes.find(p => p.processId === parsedProcessId);
  const {tasks, addTask} = use(TaskContext);
  const [isProcessDetailsDialogOpen, setIsProcessDetailsDialogOpen] = useState(false);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);

  /**
   * @function handleUpdateProcess
   * @description Handles the update of process details.
   * Calls the updateProcess function from ProcessContext with the new name and description.
   * @param newName The new name for the process. May be undefined, in which case the current name is retained.
   * @param newDescription The new description for the process.
   * May be undefined, in which case the current description is retained.
   */
  function handleUpdateProcess(newName, newDescription) {
    updateProcess(parsedProcessId, {
      processName: newName || foundProcess.processName,
      processDescription: newDescription || foundProcess.processDescription
    });
    setIsProcessDetailsDialogOpen(false);
  }

  //TODO: expand documentation
  /**
   * @function handleAddTask
   * @description Handles the addition of a new task to the current process.
   * @returns {Promise<void>}
   */
  async function handleAddTask(taskName, taskDescription) {
    try {
      await addTask(parsedProcessId, taskName, taskDescription);
      //TODO: A bit of a hack to refresh process task list, rewrite
      await fetchProcessById(parsedProcessId);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  // Render error messages for invalid or not found process
  if (!parsedProcessId) {
    return (
      <div>
        <p>Invalid process ID</p>
        <p>{parsedProcessId}</p>
        <Link to="/processes">
          <button>
            Return to Processes
          </button>
        </Link>
      </div>
    )
  }

  if (!foundProcess) {
    return (
      <div>
        <p>Process not found</p>
        <Link to="/processes">
          <button>
            Return to Processes
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/processes">
        <button>
          Return to Processes
        </button>
      </Link>
      <h1>{foundProcess.processName}</h1>
      <p>Process ID: {foundProcess.processId}</p>
      <p>Description: {foundProcess.processDescription}</p>
      <div>
        <button onClick={() => setIsProcessDetailsDialogOpen(true)}>Show Process Details</button>
        <EditProcessDetailsDialog
          currentName={foundProcess.processName}
          currentDescription={foundProcess.processDescription}
          onSave={handleUpdateProcess}
          isOpen={isProcessDetailsDialogOpen}
          onClose={() => setIsProcessDetailsDialogOpen(false)}
        />
      </div>

      <button onClick={() => {
        setIsTaskDetailsDialogOpen(true)
      }}>
        Add Task
      </button>
      <AddTaskDialog
        isOpen={isTaskDetailsDialogOpen}
        onSave={handleAddTask}
        onClose={() => setIsTaskDetailsDialogOpen(false)}
      />

      <ul>
        {foundProcess.taskIds.map((taskId) => {
          const task = tasks.find(t => t.taskId === taskId);
          if (!task) {
            return;
          }
          return (
            <li key={task.taskId}>
              <TaskCard
                processId={parsedProcessId}
                taskId={task.taskId}
                taskName={task.taskName}
                taskDescription={task.taskDescription}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
