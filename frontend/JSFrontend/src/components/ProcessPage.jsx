import {Link} from 'react-router';
import {useParams} from "react-router";
import {use, useEffect} from "react";
import TaskCard from "./TaskCard.jsx";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {useState} from "react";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import EditProcessDetailsDialog from "./EditProcessDetailsDialog.jsx";
import AddTaskDialog from "./AddTaskDialog.jsx";
import '@xyflow/react/dist/style.css'
import {ReactFlow} from "@xyflow/react";
import ProcessNode from "./ProcessNode.jsx";
import TaskNode from "./TaskNode.jsx";

// Define custom node types for React Flow
const nodeTypes = {
  processNode: ProcessNode,
  taskNode: TaskNode
}

/**
 * @component ProcessPage
 * @description A page component that displays details for a specific process.
 * Retrieves the processId from the URL parameters and provides navigation back to the dashboard.
 * Allows adding tasks to the process and displays them using TaskCard components.
 * Displays an error message if the processId is invalid.
 * @returns {JSX.Element} The rendered ProcessPage component.
 */
export default function ProcessPage() {
  const {processId} = useParams();
  const {processes, updateProcess, fetchProcessById} = use(ProcessContext);
  const parsedProcessId = processId ? parseInt(processId) : undefined;
  const foundProcess = processes.find(p => p.processId === parsedProcessId);
  const {tasks, addTask} = use(TaskContext);
  const [isProcessDetailsDialogOpen, setIsProcessDetailsDialogOpen] = useState(false);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    generateNodesAndEdges();
  }, [foundProcess]);

  function generateNodesAndEdges() {
    if (!foundProcess) {
      return;
    }
    // Layout constants
    const branchX = 300;
    const rootX = 0;
    const verticalSpacing = 160;

    const taskNodes = [];
    for (let i = 0; i < foundProcess.taskIds.length; i++) {
      const task = tasks.find(t => t.taskId === foundProcess.taskIds[i]);
      if (!task) continue;
      const taskNode = {
        id: 'task-' + task.taskId,
        type: 'taskNode',
        // Position will be set later
        // position: {x: branchX, y: i * 200},
        data: {label: task.taskName},
      }
      taskNodes.push(taskNode);
    }

    const totalHeight = (taskNodes.length - 1) * verticalSpacing;
    const centerOffset = totalHeight / 2;

    const positionedTaskNodes = taskNodes.map((node, index) => {
      return {
        ...node,
        position: {
          x: branchX,
          y: index * verticalSpacing - centerOffset
        }
      }
    });

    const processNode = {
      id: 'process-' + foundProcess.processId,
      type: 'processNode',
      position: {x: rootX, y: 0},
      data: {label: foundProcess.processName},
    }

    setNodes([processNode, ...positionedTaskNodes]);
  }

  /**
   * @function handleUpdateProcess
   * @description Handles the update of process details.
   * Calls the updateProcess function from ProcessContext with the new name and description.
   * @param newName The new name for the process. May be undefined, in which case the current name is retained.
   * @param newDescription The new description for the process.
   * May be undefined, in which case the current description is retained.
   */
  function handleUpdateProcess(newName, newDescription) {
    updateProcess(parsedProcessId, {
      processName: newName || foundProcess.processName,
      processDescription: newDescription || foundProcess.processDescription
    });
    setIsProcessDetailsDialogOpen(false);
  }

  /**
   * @function handleAddTask
   * @description Handles the addition of a new task to the current process.
   * Calls the addTask function from TaskContext with the process ID, task name, and task description.
   * @param {string} taskName - The name of the task to be added.
   * @param {string} taskDescription - The description of the task to be added.
   * @returns {Promise<void>} A promise that resolves when the task has been added.
   */
  async function handleAddTask(taskName, taskDescription) {
    try {
      await addTask(parsedProcessId, taskName, taskDescription);
      //TODO: A bit of a hack to refresh process task list, rewrite
      await fetchProcessById(parsedProcessId);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  // Render error messages for invalid or not found process
  if (!parsedProcessId) {
    return (
      <div>
        <p>Invalid process ID</p>
        <p>{parsedProcessId}</p>
        <Link to="/processes">
          <button>
            Return to Processes
          </button>
        </Link>
      </div>
    )
  }

  if (!foundProcess) {
    return (
      <div>
        <p>Process not found</p>
        <Link to="/processes">
          <button>
            Return to Processes
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/processes">
        <button>
          Return to Processes
        </button>
      </Link>
      <h1>{foundProcess.processName}</h1>
      <p>Process ID: {foundProcess.processId}</p>
      <p>Description: {foundProcess.processDescription}</p>
      <div>
        <button onClick={() => setIsProcessDetailsDialogOpen(true)}>Show Process Details</button>
        <EditProcessDetailsDialog
          currentName={foundProcess.processName}
          currentDescription={foundProcess.processDescription}
          onSave={handleUpdateProcess}
          isOpen={isProcessDetailsDialogOpen}
          onClose={() => setIsProcessDetailsDialogOpen(false)}
        />
      </div>

      <button onClick={() => {
        setIsTaskDetailsDialogOpen(true)
      }}>
        Add Task
      </button>
      <AddTaskDialog
        isOpen={isTaskDetailsDialogOpen}
        onSave={handleAddTask}
        onClose={() => setIsTaskDetailsDialogOpen(false)}
      />

      <div style={{width: '70vh', height: '70vh', border: '2px solid white', marginTop: '20px'}}>
        <ReactFlow
          nodes={nodes}
          // edges={edges}
          nodeTypes={nodeTypes}
          proOptions={{hideAttribution: true}}
          fitView
          nodesDraggable={false}
        />
      </div>

      {/*<ul>*/}
      {/*  {foundProcess.taskIds.map((taskId) => {*/}
      {/*    const task = tasks.find(t => t.taskId === taskId);*/}
      {/*    if (!task) {*/}
      {/*      return;*/}
      {/*    }*/}
      {/*    return (*/}
      {/*      <li key={task.taskId}>*/}
      {/*        <TaskCard*/}
      {/*          processId={parsedProcessId}*/}
      {/*          taskId={task.taskId}*/}
      {/*          taskName={task.taskName}*/}
      {/*          taskDescription={task.taskDescription}*/}
      {/*        />*/}
      {/*      </li>*/}
      {/*    )*/}
      {/*  })}*/}
      {/*</ul>*/}
    </div>
  )
}
