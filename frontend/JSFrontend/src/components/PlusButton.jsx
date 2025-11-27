import {useState} from "react";
import plusIcon from '../assets/plusIcon.svg';
import AddTaskDialog from "./AddTaskDialog.jsx";
import '../style/PlusButton.css'

export default function PlusButton({parentTaskId, position = 'right'}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        isOpen={isDialogOpen}
        parentTaskId={parentTaskId}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
