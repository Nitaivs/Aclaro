import {Handle, Position, useReactFlow} from "@xyflow/react";
import {useNavigate, useLocation} from 'react-router';
import PlusButton from "./PlusButton.jsx";

/**
 * @component TaskNode
 * @description A custom node component for representing a task in a React Flow diagram.
 * Displays the task name and provides handles for connecting to other nodes.
 * if the task has outgoing edges, a source handle is displayed on the right side.
 * The task name is a clickable link that navigates to the task's detail page.
 * A PlusButton is included for adding new tasks.
 * @param data - Object containing task details
 * @param label - The name of the task.
 * @param taskId - The ID of the task associated with this node.
 * @param id - The ID of the node in the React Flow diagram.
 * @returns {JSX.Element} The rendered TaskNode component.
 */
export default function TaskNode({data: {label, taskId}, id}) {
  const {getEdges} = useReactFlow();
  const edges = getEdges();

  const navigate = useNavigate();
  const location = useLocation();

  function openTaskModal() {
    navigate(`/tasks/${taskId}`, {state: {background: location}});
  }

  const hasOutgoingEdges = edges.some(edge => edge.source === id);
  return (
    <div style={{ position:'relative'}}>
      <div onClick={openTaskModal} className="task-node">
        <Handle type="target" position={Position.Left}/>
          <div className="task-node-label">
            {label}
          </div>
        {hasOutgoingEdges && <Handle type="source" position={Position.Right}/>}
      </div>
        <PlusButton parentTaskId={taskId} onClick={() => console.log("clicked")} position="right"/>
    </div>
  )
}
