import {use, useState} from "react";
import plusIcon from '../assets/plusIcon.svg';
import AddTaskDialog from "./AddTaskDialog.jsx";
import '../style/PlusButton.css'
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {ProcessOperationsContext} from "../Context/ProcessOperationsContext/ProcessOperationsContext.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import { toast } from "react-toastify";

/**
 * @component PlusButton
 * @description A button component that opens a dialog to add a new task.
 * Positioned either to the right or bottom of its container.
 * @param {Object} props - The properties for the PlusButton component.
 * @param {number|null} props.parentTaskId - The ID of the parent task to which the new task will be added. If null, the task is added at the root level.
 * @param {String} props.position - A string indicating the position of the button. Defaults to 'right'.
 * @returns {React.JSX.Element} The rendered PlusButton component.
 */
export default function PlusButton({parentTaskId, position = 'right'}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {addTask} = use(TaskContext);
  const {processId} = use(ProcessOperationsContext);
  const {fetchProcessById} = use(ProcessContext);

  /**
   * @function handleAddTask
   * @description Handles the addition of a new task.
   * Calls the addTask function from TaskContext and refreshes the process data.
   * @param {String} name - The name of the new task.
   * @param {String} description - The description of the new task.
   * @returns {Promise<void>} A promise that resolves when the task is added and the process data is refreshed.
   */
  async function handleAddTask(name, description) {
    try {
      if (!processId) {
        console.error("No processId available in context");
        return;
      }
      console.log(`Adding task to process ${processId} with name: ${name}, description: ${description}, parentTaskId: ${parentTaskId}`);
      await addTask(processId, name, description, parentTaskId);
      await fetchProcessById(processId);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Error adding task: " + error.message);
    }
  }

  return (
    <div className={`plus-button-container position-${position}`}>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="plus-button"
        aria-label="Add Task"
      >
        <img
          src={plusIcon}
          alt="Add Task"
          className={`plus-button-icon position-${position}`}
        />
      </button>
      <AddTaskDialog
        onSave={handleAddTask}
        isOpen={isDialogOpen}
        parentTaskId={parentTaskId}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
