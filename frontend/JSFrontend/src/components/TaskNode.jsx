import {Handle, Position, useReactFlow} from "@xyflow/react";

export default function TaskNode({data, id}) {
  const {getEdges} = useReactFlow();
  const edges = getEdges();

  const hasOutgoingEdges = edges.some(edge => edge.source === id);
  return (
    <div style={{
      borderRadius: 6,
      background: 'lightgreen',
      padding: 4,
      display: 'inline-block',
      border: '2px solid darkgreen',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
    }}>
      <div style={{padding: 12, fontWeight: 'bold', textAlign: 'center', color: 'black'}}>
        <Handle type="target" position={Position.Left}/>
        {data.label}
      </div>
      {hasOutgoingEdges && <Handle type="source" position={Position.Right}/>}
    </div>
  )
}
