import {BaseEdge, EdgeLabelRenderer, getBezierPath} from "@xyflow/react";
import plusIcon from '../assets/plusIcon.svg';
import '../style/PlusButton.css'
import {use, useState} from "react";
import AddTaskDialog from "./AddTaskDialog.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {ProcessOperationsContext} from "../Context/ProcessOperationsContext/ProcessOperationsContext.jsx";

export default function CustomEdge({
                                     id,
                                     sourceX,
                                     sourceY,
                                     targetX,
                                     targetY,
                                     sourcePosition,
                                     targetPosition,
                                     data
                                   }) {
  const {addTaskBetweenTasks} = use(TaskContext);
  const {processId} = use(ProcessOperationsContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });


  async function handleAddTaskBetweenTasks(name, description) {
    //TODO: implement adding task between two tasks
    console.log("AddTaskBetweenTasks");
    try {
      await addTaskBetweenTasks(
        processId,
        name,
        description,
        data.parentTaskId,
        data.childTaskId
      );
    } catch (error) {
      //TODO: add error toast notification to UI
      console.error("Error adding task between tasks:", error);
    }
  }

  if (!data?.parentTaskId || !data?.childTaskId) {
    return <BaseEdge id={id} path={edgePath}/>
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{strokeWidth: isHovered ? 3 : 2}}
        interactionWidth={20}

      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        pointerEvents="stroke"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <EdgeLabelRenderer>
        {isHovered && (
          <div
            className="edge-label-wrapper"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            onMouseEnter={() => setIsHovered(true)}
          >
            <button
              onMouseLeave={() => setIsHovered(false)}
              className="plus-button"
              onClick={() => setIsDialogOpen(true)}>
              <img
                src={plusIcon}
                alt="Add Task"
                className={`plus-button-icon position-center`}
              />
            </button>
          </div>

        )}
      </EdgeLabelRenderer>
      <AddTaskDialog
        onSave={handleAddTaskBetweenTasks}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
