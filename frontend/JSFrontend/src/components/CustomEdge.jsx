import {BaseEdge, EdgeLabelRenderer, getBezierPath} from "@xyflow/react";
import plusIcon from '../assets/plusIcon.svg';
import '../style/PlusButton.css'
import {use, useState} from "react";
import AddTaskDialog from "./AddTaskDialog.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {ProcessOperationsContext} from "../Context/ProcessOperationsContext/ProcessOperationsContext.jsx";

/**
 * @component CustomEdge
 * @description A custom edge component for a React Flow diagram. Displays an edge with a plus button when hovered,
 * allowing users to add a task between two existing tasks.
 * @param {String} id - The unique identifier for the edge.
 * @param {number}sourceX - The x-coordinate of the source node.
 * @param {number} sourceY - The y-coordinate of the source node.
 * @param {number} targetX - The x-coordinate of the target node.
 * @param {number} targetY  - The y-coordinate of the target node.
 * @param {String} sourcePosition - The position of the source handle.
 * @param {String} targetPosition - The position of the target handle.
 * @param {Object} data - Additional data associated with the edge, including parentTaskId and childTaskId.
 * @returns {React.JSX.Element} - The rendered CustomEdge component.
 */
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


  /**
   * @function handleAddTaskBetweenTasks
   * @description Handles the addition of a new task between two existing tasks.
   * Calls the addTaskBetweenTasks function from DataContext with the provided task details.
   * @param {String} name - The name of the new task.
   * @param {String} description - The description of the new task.
   * @returns {Promise<void>} - A promise that resolves when the task is added or an error occurs.
   */
  async function handleAddTaskBetweenTasks(name, description) {
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
