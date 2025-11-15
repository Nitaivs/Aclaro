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
import {
  ProcessOperationsContext,
  ProcessOperationsProvider
} from "../Context/ProcessOperationsContext/ProcessOperationsContext.jsx";

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
  const {processes, updateProcess} = use(ProcessContext);
  const parsedProcessId = processId ? parseInt(processId) : undefined;
  const foundProcess = processes.find(p => p.processId === parsedProcessId);
  const {tasks} = use(TaskContext);
  const [associatedTasks, setAssociatedTasks] = useState([]);
  const [isProcessDetailsDialogOpen, setIsProcessDetailsDialogOpen] = useState(false);
  // const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  /**
   * @effect Update associated tasks when foundProcess or tasks change
   */
  useEffect(() => {
    setAssociatedTasks(findAssociatedTasks)
  }, [foundProcess, tasks]);

  /**
   * @effect Generate nodes and edges for React Flow when associatedTasks change
   */
  useEffect(() => {
    generateNodesAndEdges();
  }, [associatedTasks]);

  /**
   * @function findAssociatedTasks
   * @description Finds and returns tasks associated with the found process.
   * @returns {*[]} An array of tasks associated with the found process.
   */
  function findAssociatedTasks() {
    if (!foundProcess) {
      return [];
    }
    const associated = [];
    for (const taskId of foundProcess.taskIds) {
      const task = tasks.find(t => t.taskId === taskId);
      if (task) {
        associated.push(task);
      }
    }
    return associated;
  }

  //TODO: refactor. Move into separate utility file and divide into smaller functions
  function generateNodesAndEdges() {
    if (!foundProcess) {
      return;
    }
    // Layout constants
    const horizontalSpacing = 300;
    const verticalSpacing = 160;
    const nodes = [];
    const edges = [];

    function buildTree() {
      const rootNode = {
        id: `process-${foundProcess.processId}`,
        type: 'processNode',
        data: {label: foundProcess.processName},
        children: []
      }

      const taskMap = new Map(associatedTasks.map(task => [task.taskId, task]))

      function buildSubtree(task) {
        const node = {
          id: `task-${task.taskId}`,
          type: 'taskNode',
          data: {label: task.taskName, taskId: task.taskId},
          children: []
        };

        if (task.subTasks && task.subTasks.length > 0) {
          for (const subTask of task.subTasks) {
            const fullSubTask = taskMap.get(subTask.taskId);
            if (fullSubTask) {
              node.children.push(buildSubtree(fullSubTask));
            }
          }
        }
        return node;
      }

      associatedTasks
        .filter(task => task.parentTaskId === null)
        .forEach(task => {
          rootNode.children.push(buildSubtree(task));
        });

      return rootNode;
    }

    function calculateSubtreeSize(node) {
      if (node.children.length === 0) return 1;
      return node.children.reduce((sum, child) => sum + calculateSubtreeSize(child), 0);
    }

    function layoutTree(node, x, yStart, yEnd) {
      const yCenter = (yStart + yEnd) / 2;
      nodes.push({
        id: node.id,
        type: node.type,
        data: node.data,
        position: {x: x, y: yCenter}
      })
      if (node.children.length === 0) return;

      let currentY = yStart;
      node.children.forEach((child) => {
        const subtreeSize = calculateSubtreeSize(child);
        const childHeight = subtreeSize * verticalSpacing;
        const childYStart = currentY;
        const childYEnd = currentY + childHeight;
        edges.push({
          id: `edge-${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          animated: false
        });
        layoutTree(child, x + horizontalSpacing, childYStart, childYEnd, currentY = childYEnd);
      });
    }

    const tree = buildTree();
    const totalSize = calculateSubtreeSize(tree);
    const totalHeight = totalSize * verticalSpacing;
    layoutTree(tree, 0, -totalHeight / 2, totalHeight / 2);

    setNodes(nodes);
    setEdges(edges);
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
  // async function handleAddTask(taskName, taskDescription, parentTaskId = null) {
  //   try {
  //     await addTask(parsedProcessId, taskName, taskDescription);
  //     //TODO: A bit of a hack to refresh process task list, rewrite
  //     await fetchProcessById(parsedProcessId);
  //   } catch (error) {
  //     console.error("Error adding task:", error);
  //   }
  // }

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
      {/*<h1>{foundProcess.processName}</h1>*/}
      {/*<p>Process ID: {foundProcess.processId}</p>*/}
      {/*<p>Description: {foundProcess.processDescription}</p>*/}
      <div>
        <button onClick={() => setIsProcessDetailsDialogOpen(true)}>
          Edit Process Details
        </button>
        <EditProcessDetailsDialog
          currentName={foundProcess.processName}
          currentDescription={foundProcess.processDescription}
          onSave={handleUpdateProcess}
          isOpen={isProcessDetailsDialogOpen}
          onClose={() => setIsProcessDetailsDialogOpen(false)}
        />
      </div>

      {/*<button onClick={() => {*/}
      {/*  setIsTaskDetailsDialogOpen(true)*/}
      {/*}}>*/}
      {/*  Add Task*/}
      {/*</button>*/}
      {/*<AddTaskDialog*/}
      {/*  isOpen={isTaskDetailsDialogOpen}*/}
      {/*  onSave={handleAddTask}*/}
      {/*  onClose={() => setIsTaskDetailsDialogOpen(false)}*/}
      {/*/>*/}

      <div style={{width: '100vh', height: '100vh', border: '2px solid black', marginTop: '20px'}}>
        <ProcessOperationsProvider processId={parsedProcessId}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            proOptions={{hideAttribution: true}}
            fitView
            nodesDraggable={false}
          />
        </ProcessOperationsProvider>
      </div>

      {/*TODO: remove after making sure it's no longer needed*/}
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
