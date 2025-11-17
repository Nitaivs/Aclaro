import Card from '@mui/material/Card';
import {Link} from 'react-router';
import {use, useState} from "react";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import ErrorDialog from "./ErrorDialog.jsx";

/**
 * @component TaskCard
 * @description A card component that displays information about a task within a process.
 * The card serves as a link to the detailed task page.
 * @param props The properties for the TaskCard component.
 * @param props.processId The ID of the process to which the task belongs.
 * @param props.taskId The ID of the task.
 * @param props.taskName The name of the task.
 * @returns {JSX.Element} The rendered TaskCard component.
 */
export default function TaskCard({processId, taskId, taskName, taskDescription}) {
  const {deleteTask} = use(TaskContext);
  const {deleteTaskIdFromProcess} = use(ProcessContext);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleDeleteTask() {
    try {
      await deleteTask(taskId);
      //TODO: A bit of a hack to refresh process task list, rewrite
      deleteTaskIdFromProcess(processId, taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage(error.message);
      setShowErrorDialog(true);
    }
  }

  return (
    <div>
      <Card>
        <Link to={`/tasks/${taskId}`}>
          <h2>{taskName}</h2>
          <p>{taskDescription}</p>
        </Link>
        <button onClick={() => handleDeleteTask()}>delete</button>
      </Card>
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Error Deleting Task"
        message={errorMessage}
      />
    </div>
  );
}
