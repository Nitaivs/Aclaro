import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import {use, useState} from "react";
import {ProcessOperationsContext} from "../Context/ProcessOperationsContext/ProcessOperationsContext.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";

export default function AddTaskDialog({isOpen, onClose, parentTaskId}) {
  const {addTask} = use(TaskContext);
  const {processId} = use(ProcessOperationsContext);
  const {fetchProcessById} = use(ProcessContext);
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [nameError, setNameError] = useState(false);

  //TODO: improve error handling across file

  /**
   * @function handleAddTask
   * @description Handles the save action for adding a new task.
   * Calls the addTask function from context with the provided inputs.
   * The addTask function should be passed from the ProcessPage component via context.
   * @returns {Promise<void>}
   */
  async function handleAddTask() {
    try {
      if (!processId) {
        console.error("No processId available in context");
        handleOnClose();
        return;
      }
      if (!nameInput) {
        setNameError(true);
        return;
      }
      console.log(`Adding task to process ${processId} with name: ${nameInput}, description: ${descriptionInput}, parentTaskId: ${parentTaskId}`);
      const result = await addTask(processId, nameInput, descriptionInput, parentTaskId);
      console.log("Task added successfully:", result);
      setNameError(false);
      //TODO: hack to refresh process task list, rewrite
      await fetchProcessById(processId);
      handleOnClose()
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  function handleOnClose() {
    setNameInput("");
    setDescriptionInput("");
    onClose();
  }

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Add New Task</DialogTitle>
      <div style={{padding: '0 24px 24px 24px'}}>
        <TextField
          autoFocus
          margin="dense"
          label="Task Name"
          type="text"
          fullWidth
          variant="outlined"
          required={true}
          error={nameError}
          helperText={nameError ? "Task name is required" : ""}
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Task Description"
          type="text"
          fullWidth
          variant="outlined"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
        />
        <button onClick={() => handleAddTask()}>Add</button>
        <button onClick={() => {
          setNameInput("");
          setDescriptionInput("");
          onClose();
        }}>Cancel
        </button>
      </div>
    </Dialog>
  )
}
