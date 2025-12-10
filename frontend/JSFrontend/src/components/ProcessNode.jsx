import {Handle, Position} from "@xyflow/react";
import PlusButton from "./PlusButton.jsx";
import '../style/ReactFlow.css'

/**
 * @component ProcessNode
 * @description A custom node component for React Flow representing a process.
 * It displays the process label and includes a handle for connecting to other nodes,
 * as well as a PlusButton for adding new tasks.
 * @param {Object} data - The data object containing the label for the process node.
 * @param {String} label - The label of the process node.
 * @returns {React.JSX.Element} The rendered ProcessNode component.
 */
export default function ProcessNode({data: {label}}) {
  return (
    <div className="process-node">
      <div className="process-node-label">
        {label}
      </div>
      <Handle type="source" position={Position.Right}/>
      <PlusButton parentTaskId={null}/>
    </div>
  )
}


