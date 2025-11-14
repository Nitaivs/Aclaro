import {Handle, Position} from "@xyflow/react";

export default function ProcessNode({data}) {
  return (
    <div style={{ borderRadius: 6, background: 'lightyellow', padding: 4, display: 'inline-block'}}>
      <div style={{padding: 12, fontWeight: 'bold', textAlign: 'center', color: 'black'}}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Right}/>
    </div>
  )
}


