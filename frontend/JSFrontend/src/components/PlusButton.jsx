import {use, useState} from "react";
import plusIcon from '../assets/plusIcon.svg';
import AddTaskDialog from "./AddTaskDialog.jsx";
import '../style/PlusButton.css'
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {ProcessOperationsContext} from "../Context/ProcessOperationsContext/ProcessOperationsContext.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import { toast } from "react-toastify";

export default function PlusButton({parentTaskId, position = 'right'}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {addTask} = use(TaskContext);
  const {processId} = use(ProcessOperationsContext);
  const {fetchProcessById} = use(ProcessContext);

  async function handleAddTask(name, description) {
    try {
      if (!processId) {
        console.error("No processId available in context");
        return;
      }
      console.log(`Adding task to process ${processId} with name: ${name}, description: ${description}, parentTaskId: ${parentTaskId}`);
      await addTask(processId, name, description, parentTaskId);
      //TODO: hack to refresh process task list, rewrite
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
