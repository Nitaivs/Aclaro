import {Handle, Position} from "@xyflow/react";
import PlusButton from "./PlusButton.jsx";

export default function ProcessNode({data}) {
  return (
    <div style={{
      borderRadius: 6,
      background: 'lightblue',
      padding: 4,
      display: 'inline-block',
      border: '2px solid darkblue',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
    }}>
      <div style={{padding: 12, fontWeight: 'bold', textAlign: 'center', color: 'black'}}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Right}/>
      <PlusButton onClick={() => console.log("clicked")}/>
    </div>
  )
}


