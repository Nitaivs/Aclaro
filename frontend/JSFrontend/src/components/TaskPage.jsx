import {Link, useParams} from "react-router";
import {use, useState} from 'react';
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import EditTaskDetailsDialog from "./EditTaskDetailsDialog.jsx";
import ErrorDialog from "./ErrorDialog.jsx";
import AreYouSureDialog from "./AreYouSureDialog.jsx";

/**
 * @component TaskPage
 * @description A page component that displays details for a specific task within a process.
 * Retrieves the processId and taskId from the URL parameters and provides navigation back to the associated process page.
 * @returns {JSX.Element} The rendered TaskPage component.
 */
export default function TaskPage() {
  const {processId, taskId} = useParams();
  const {tasks, updateTask, deleteTask} = use(TaskContext);
  const {deleteTaskIdFromProcess} = use(ProcessContext);
  const parsedTaskId = taskId ? parseInt(taskId) : undefined;
  const foundTask = tasks.find(t => t.taskId === parsedTaskId);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  /**
   * @function handleUpdateTask
   * @description Handles the update of task details.
   * Calls the updateTask function from TaskContext with the new name and description.
   * @param newName the new name for the task. May be undefined, in which case the current name is retained.
   * @param newDescription the new description for the task. May be undefined, in which case the current description is retained.
   * @returns {Promise<void>} A promise that resolves when the task update is complete.
   */
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

  async function handleDeleteTask() {
    try {
      await deleteTask(taskId);
      //TODO: A bit of a hack to refresh process task list, rewrite
      deleteTaskIdFromProcess(processId ,taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage(error.message);
      setShowErrorDialog(true);
    }
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
      <Link to={`/process/${foundTask.processId}`}>
        <button>
          Go back to process {processId}
        </button>
      </Link>
      <h1>{foundTask.taskName}</h1>
      <p>taskId: {taskId}</p>
      <p>description: {foundTask.taskDescription}</p>
      <button onClick={() => setIsTaskDetailsDialogOpen(true)}>Edit Task Details</button>
      <button onClick={() => setShowDeleteDialog(true)}>Delete Task</button>
      <EditTaskDetailsDialog
        currentName={foundTask.taskName}
        currentDescription={foundTask.taskDescription}
        onSave={handleUpdateTask}
        isOpen={isTaskDetailsDialogOpen}
        onClose={() => setIsTaskDetailsDialogOpen(false)}
      />
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Error Deleting Task"
        message={errorMessage}
      />
      <AreYouSureDialog
        isOpen={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteTask}
        title="Confirm Delete Task"
        message={`Are you sure you want to delete the task "${foundTask.taskName}"? This action cannot be undone.`}
        />
    </div>
  )
}
