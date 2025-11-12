import '@xyflow/react/dist/style.css'
import {ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge} from "@xyflow/react";
import {use, useEffect, useState, useCallback} from "react";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";

//TODO: remove this demo component later
export default function ReactFlowDemo() {
  const {processes} = use(ProcessContext);
  const {tasks} = use(TaskContext);
  const initialNodes = [
    {id: 'n1', position: {x: 0, y: 0}, data: {label: 'Node 1'}, style: {backgroundColor: 'lightgreen'}},
    {id: 'n2', position: {x: 0, y: 100}, data: {label: 'Node 2'}, style: {backgroundColor: 'lightblue'}},
    // RF tries to center the view on the nodes, so placing n3 far to the right to demonstrate panning
    // {id: 'n3', position: {x: 2000, y: 100}, data: {label: 'Node 3'}, style: {backgroundColor: 'lightcoral'}},
  ];
  //
  // useEffect(() => {
  //   initializeProcessNodes();
  // }, [processes, tasks])
  //
  // function initializeProcessNodes() {
  //   setNodes(processes.map(process => {
  //     console.log(process);
  //     return {
  //       id: `p${process.processId}`,
  //       position: {x: Math.random() * 400, y: Math.random() * 400},
  //       data: {label: `Process: ${process.processName}`},
  //       style: {backgroundColor: 'lightgreen'}
  //     }
  //   }));
  // }

  const initialEdges = [{id: 'n1-n2', source: 'n1', target: 'n2'}];
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Called when nodes are changed (e.g., moved, deleted)
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot))
      console.log("Nodes changed:", changes);
    }, [],
  );
  // Called when edges are changed (e.g., moved, deleted)
  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot))
      console.log("Edges changed:", changes);
    },
    [],
  );
  // Called when a connection is made between two nodes
  const onConnect = useCallback(
    (params) => {
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot))
      console.log("Edge connected:", params);
    },
    [],
  );

  function addNode() {
    const newNode = {
      id: `n${nodes.length + 1}`,
      position: {x: Math.random() * 400, y: Math.random() * 400},
      data: {label: `Node ${nodes.length + 1}`},
      style: {backgroundColor: 'lightgray'}
    };
    setNodes([...nodes, newNode]);
  }

  return (
    <div>
      <h1>React flow demo</h1>
      <button onClick={addNode}>Add Node</button>
      <div style={{width: '90vw', height: '90vh', border: '3px solid white'}}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodesDraggable={true}
        />
      </div>
    </div>
  );
}
