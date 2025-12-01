import {useLocation, useNavigate} from "react-router";
import {IconButton} from "@mui/material";
import EditIcon from "../assets/edit.svg";
import DeleteIcon from "../assets/delete.svg";
import EditTaskDetailsDialog from "./EditTaskDetailsDialog.jsx";
import ErrorDialog from "./ErrorDialog.jsx";
import AreYouSureDialog from "./AreYouSureDialog.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {use, useState} from "react";
import '../style/ItemCard.css'

/**
 * @component TaskCard
 * @description A card component that displays information about a task within a process.
 * The card serves as a link to the detailed task page.
 * @param props The properties for the TaskCard component.
 * @param {number} props.taskId The ID of the task.
 * @returns {JSX.Element} The rendered TaskCard component.
 */
export default function TaskItem({taskId}) {
  const {tasks, updateTask, deleteTask} = use(TaskContext);
  const {deleteTaskIdFromProcess} = use(ProcessContext);
  const foundTask = tasks.find(t => t.id === taskId);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function openTaskModal() {
    navigate(`/tasks/${taskId}`, {state: {background: location}});
  }

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
    await updateTask(foundTask.id, {
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
      deleteTaskIdFromProcess(foundTask.id, taskId);
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
      </div>
    )
  }

  return (
    <>
      <div>
        <div className="item-card">
          <div className="item-card-content" onClick={openTaskModal} style={{cursor: 'pointer'}}>
            <div className="item-card-info">
              <h4 style={{color: 'red'}}>Task</h4>
              <span>|</span>
              <h4>{foundTask.name}</h4>
            </div>
            <div className="item-card-info">
              {foundTask.description && <p>Description: {foundTask.description}</p>}
            </div>
          </div>
          <div className="item-card-actions">
            <IconButton
              onClick={() => setIsTaskDetailsDialogOpen(true)}
              aria-label="edit"
              size="small"
            >
              <img src={EditIcon} alt="Edit" width={30} height={30}/>
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => setShowDeleteDialog(true)}
            >
              <img src={DeleteIcon} alt="Delete" width={30} height={30}/>
            </IconButton>
          </div>
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
    </>
  );
}
