import {Link, useParams} from "react-router";
import {use, useState} from 'react';
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import EditTaskDetailsDialog from "./EditTaskDetailsDialog.jsx";

/**
 * @component TaskPage
 * @description A page component that displays details for a specific task within a process.
 * Retrieves the processId and taskId from the URL parameters and provides navigation back to the associated process page.
 * @returns {JSX.Element} The rendered TaskPage component.
 */
export default function TaskPage() {
  const {processId, taskId} = useParams();
  const {tasks, updateTask} = use(TaskContext);
  const parsedTaskId = taskId ? parseInt(taskId) : undefined;
  const foundTask = tasks.find(t => t.taskId === parsedTaskId);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);

  async function handleUpdateTask(newName, newDescription) {
    if (newName === foundTask.taskName && newDescription === foundTask.taskDescription) {
      setIsTaskDetailsDialogOpen(false);
      return;
    }
    await updateTask(parsedTaskId, {
      taskName: newName || foundTask.taskName,
      taskDescription: newDescription || foundTask.taskDescription
    });
    setIsTaskDetailsDialogOpen(false);
  }

  if (!foundTask) {
    return (
      <div>
        <p>Task not found</p>
        <Link to={`/process/${processId}`}>
          <button>
            Go back to process {processId}
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to={`/process/${processId}`}>
        <button>
          Go back to process {processId}
        </button>
      </Link>
      <h1>{foundTask.taskName}</h1>
      <p>taskId: {taskId}</p>
      <p>description: {foundTask.taskDescription}</p>
      <button onClick={() => setIsTaskDetailsDialogOpen(true)}>Edit Task Details</button>
      <EditTaskDetailsDialog
        currentTaskName={foundTask.taskName}
        currentTaskDescription={foundTask.taskDescription}
        onSave={handleUpdateTask}
        isOpen={isTaskDetailsDialogOpen}
        onClose={() => setIsTaskDetailsDialogOpen(false)}
      />
    </div>
  )
}
