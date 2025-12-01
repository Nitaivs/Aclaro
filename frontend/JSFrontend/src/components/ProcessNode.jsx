import {Handle, Position} from "@xyflow/react";
import PlusButton from "./PlusButton.jsx";
import '../style/ReactFlow.css'

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


