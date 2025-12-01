import {useParams, useNavigate} from "react-router";
import {use, useState} from 'react';
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import EditTaskDetailsDialog from "./EditTaskDetailsDialog.jsx";
import ErrorDialog from "./ErrorDialog.jsx";
import AreYouSureDialog from "./AreYouSureDialog.jsx";
import "../style/DetailPanel.css"
import {IconButton, Typography} from "@mui/material";
import deleteIcon from "../assets/delete.svg"
import editIcon from "../assets/edit.svg"

/**
 * @component TaskPage
 * @description A page component that displays details for a specific task within a process.
 * Retrieves the processId and taskId from the URL parameters and provides navigation back to the associated process page.
 * @param {Object} props The properties for the TaskPage component.
 * @param {boolean} props.isModal Indicates if the component is rendered as a modal. Defaults to false.
 * @returns {JSX.Element} The rendered TaskPage component.
 */
export default function TaskPage({isModal = false}) {
  const {processId, taskId} = useParams();
  const {tasks, updateTask, updateTaskRequirements, deleteTask} = use(TaskContext);
  const {deleteTaskIdFromProcess} = use(ProcessContext);
  const parsedTaskId = taskId ? parseInt(taskId) : undefined;
  const foundTask = tasks.find(t => t.id === parsedTaskId);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  /**
   * @function handleUpdateTask
   * @description Handles the update of task details.
   * Calls the updateTask function from TaskContext with the new name and description.
   * @param {string} newName the new name for the task. May be undefined, in which case the current name is retained.
   * @param {string} newDescription the new description for the task. May be undefined, in which case the current description is retained.
   * @returns {Promise<void>} A promise that resolves when the task update is complete.
   */
  async function handleUpdateTask(newName, newDescription) {
    if (newName === foundTask.name && newDescription === foundTask.description) {
      setIsTaskDetailsDialogOpen(false);
      return;
    }
    await updateTask(parsedTaskId, {
      name: newName || foundTask.name,
      description: newDescription || foundTask.description
    });
    setIsTaskDetailsDialogOpen(false);
  }

  /**
   * @function handleDeleteTask
   * @description Handles the deletion of the task.
   * Calls the deleteTask function from TaskContext and manages error handling.
   * @returns {Promise<void>} A promise that resolves when the task deletion is complete.
   */
  async function handleDeleteTask() {
    try {
      await deleteTask(taskId);
      //TODO: A bit of a hack to refresh process task list, rewrite
      deleteTaskIdFromProcess(processId, taskId);
      // close the modal or navigate back
      navigate(-1);
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage(error.message);
      setShowErrorDialog(true);
    }
  }

  if (!foundTask) {
    return (
      <div style={{
        display: 'flex',
        minWidth: '300px',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h3>Error</h3>
        <p>Task not found</p>
      </div>
    )
  }

  return (
    <div className={`detail-container${isModal ? " modal" : ""}`}>
      <div className="detail-header">
        <h2>Task</h2>
      </div>
      <div className="detail-content">
        <div className="detail-info">
          <h2>{foundTask.name}</h2>
          <p>{foundTask.description}</p>
        </div>
        <div className="detail-actions">
          <IconButton onClick={() => setIsTaskDetailsDialogOpen(true)}>
            <img src={editIcon} alt="Edit Task" className="icon-img"/>
          </IconButton>
          <IconButton onClick={() => setShowDeleteDialog(true)}>
            <img src={deleteIcon} alt="Delete Task" className="icon-img"/>
          </IconButton>
        </div>
      </div>

      <EditTaskDetailsDialog
        currentName={foundTask.name}
        currentDescription={foundTask.description}
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
        message={`Are you sure you want to delete the task "${foundTask.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
