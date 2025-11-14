import {Handle, Position} from "@xyflow/react";

export default function TaskNode({data}) {
  return (
    <div style={{borderRadius: 6, background: 'lightyellow', padding: 4, display: 'inline-block'}}>
      <div style={{padding: 12, fontWeight: 'bold', textAlign: 'center', color: 'black'}}>
        <Handle type="target" position={Position.Left}/>
        <Handle type="source" position={Position.Right}/>
        {data.label}
      </div>
    </div>
  )
}
