import {useParams, useNavigate} from "react-router";
import {use, useEffect} from "react";
import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {useState} from "react";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import EditProcessDetailsDialog from "./EditProcessDetailsDialog.jsx";
import AreYouSureDialog from "./AreYouSureDialog.jsx";
import '@xyflow/react/dist/style.css'
import {ReactFlow} from "@xyflow/react";
import ProcessNode from "./ProcessNode.jsx";
import TaskNode from "./TaskNode.jsx";
import {ProcessOperationsProvider} from "../Context/ProcessOperationsContext/ProcessOperationsContext.jsx";
import {IconButton} from "@mui/material";
import CustomEdge from "./CustomEdge.jsx";
import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';
import '../style/DetailPanel.css';
import '../style/ReactFlow.css';
import {DataContext} from "../Context/DataContext/DataContext.jsx";

// Define custom node types for React Flow
const nodeTypes = {
  processNode: ProcessNode,
  taskNode: TaskNode
}

// Define custom edge types for React Flow
const edgeTypes = {
  customEdge: CustomEdge
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
  const {updateProcess, deleteProcess} = use(ProcessContext);
  const {processes} = use(DataContext);
  const parsedProcessId = processId ? parseInt(processId) : undefined;
  const foundProcess = processes.find(p => p.id === parsedProcessId);
  const {tasks} = use(TaskContext);
  const navigate = useNavigate();
  const [associatedTasks, setAssociatedTasks] = useState([]);
  const [isProcessDetailsDialogOpen, setIsProcessDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  /**
   * @effect Update associated tasks when foundProcess or tasks change
   */
  useEffect(() => {
    if (!foundProcess || tasks.length === 0) {
      setAssociatedTasks([]);
      return;
    }
    const newAssociatedTasks = findAssociatedTasks()
    setAssociatedTasks(newAssociatedTasks);
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
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        associated.push(task);
      }
    }
    return associated;
  }

  /**
   * @function handleDeleteProcess
   * @description Handles the deletion of the process.
   * Calls the deleteProcess function from ProcessContext and navigates back to the processes list.
   * @returns {Promise<void>} A promise that resolves when the process deletion is complete.
   */
  async function handleDeleteProcess() {
    try {
      await deleteProcess(foundProcess.id);
      navigate('/processes');
    } catch (error) {
      console.error("Error deleting process:", error);
    }
  }

  //TODO: refactor. Move into separate utility file and divide into smaller functions
  /**
   * @function generateNodesAndEdges
   * @description Generates nodes and edges for React Flow based on the associated tasks.
   * Lays out the nodes in a tree structure with specified horizontal and vertical spacing,
   * and sets the generated nodes and edges in the component state.
   */
  function generateNodesAndEdges() {
    if (!foundProcess) {
      return;
    }
    // Layout constants
    const horizontalSpacing = 280;
    const verticalSpacing = 120;

    const nodes = [];
    const edges = [];

    /**
     * @function buildTree
     * @description Builds a tree structure representing the process and its associated tasks.
     * The root node represents the process, and child nodes represent tasks and their subtasks.
     * The root node has an id of the format 'process-{processId}', type 'processNode', and data containing the process name.
     * The root node's children are the top-level tasks associated with the process.
     * Each task node has an id of the format 'task-{taskId}', type 'taskNode', and data containing the task name and taskId.
     * Each task node's children are its subtasks, recursively built in the same manner.
     * @returns {{id: string, type: string, data: {label: string}, children: *[]}} The root node of the tree structure.
     */
    function buildTree() {
      const rootNode = {
        id: `process-${foundProcess.id}`,
        type: 'processNode',
        data: {label: foundProcess.name},
        children: []
      }

      const taskMap = new Map(associatedTasks.map(task => [task.id, task]))

      /**
       * @function buildSubtree
       * @description Recursively builds a subtree for a given task and its subtasks.
       * The subtree node has an id of the format 'task-{taskId}', type 'taskNode', and data containing the task's name and id.
       * The node's children are its subtasks, recursively built in the same manner.
       * @param task The task object for which to build the subtree.
       * @returns {{id: string, type: string, data: {label: string, taskId: number}, children: *[]}} The subtree node representing the task and its subtasks.
       */
      function buildSubtree(task) {
        const node = {
          id: `task-${task.id}`,
          type: 'taskNode',
          data: {label: task.name, taskId: task.id},
          children: []
        };

        if (task.subTasks && task.subTasks.length > 0) {
          for (const subTask of task.subTasks) {
            const fullSubTask = taskMap.get(subTask.id);
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

    /**
     * @function calculateSubtreeSize
     * @description Recursively calculates the size of a subtree rooted at the given node.
     * The size is defined as the total number of nodes in the subtree, including the root node.
     * @param node The root node of the subtree.
     * @returns {*|number} The size of the subtree.
     */
    function calculateSubtreeSize(node) {
      if (node.children.length === 0) return 1;
      return node.children.reduce((sum, child) => sum + calculateSubtreeSize(child), 0);
    }

    /**
     * @function extractTaskId
     * @description Extracts the task ID from a node ID of the format 'task-{taskId}' (e.g. 'task-123' -> 123).
     * Returns null if the node ID does not start with 'task-'.
     * @param nodeId The node ID string.
     * @returns {number|null} The extracted task ID as a number, or null if not applicable.
     */
    function extractTaskId(nodeId) {
      if (nodeId.startsWith('task-')) {
        return parseInt(nodeId.split('-')[1]);
      }
      return null;
    }

    /**
     * @function layoutTree
     * @description Recursively lays out the tree structure by assigning x and y positions to each node.
     * The root node is positioned at (x, (yStart + yEnd) / 2).
     * Child nodes are positioned horizontally spaced by horizontalSpacing and vertically distributed
     * within the range [yStart, yEnd] based on their subtree sizes.
     * @param node The current node to layout.
     * @param x The x position for the current node.
     * @param yStart The starting y position for the current node's subtree.
     * @param yEnd The ending y position for the current node's subtree.
     */
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
          type: 'customEdge',
          data: {
            parentTaskId: extractTaskId(node.id),
            childTaskId: extractTaskId(child.id),
          },
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
      name: newName || foundProcess.name,
      description: newDescription || foundProcess.description,
    });
    setIsProcessDetailsDialogOpen(false);
  }

  // Render error messages for invalid or not found process
  if (!parsedProcessId) {
    return (
      <div>
        <p>Invalid process ID</p>
        <p>{parsedProcessId}</p>
      </div>
    )
  }

  if (!foundProcess) {
    return (
      <div>
        <p>Process not found</p>
      </div>
    )
  }

  return (
    <>
      <div className="detail-container">
        {/* Header */}
        <div className="detail-header">
          <h2>
            Process
          </h2>
        </div>
        {/* Process Details */}
        <div className="detail-content">
          <div className="detail-info">
            <h2 className="detail-title">{foundProcess.name}</h2>
            <p className="detail-description">{foundProcess.description}</p>
          </div>
          <div className="detail-actions">
            <IconButton onClick={() => setIsProcessDetailsDialogOpen(true)} size="large">
              <img src={editIcon} alt="Edit Process Details" className="icon-img"/>
            </IconButton>
            <IconButton onClick={() => setIsDeleteDialogOpen(true)} size="large">
              <img src={deleteIcon} alt="Delete Process" className="icon-img"/>
            </IconButton>
          </div>
        </div>
        {/* React Flow Diagram */}
        <div className="react-flow-container">
          <ProcessOperationsProvider processId={parsedProcessId}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              proOptions={{hideAttribution: true}}
              fitView
              nodesDraggable={false}
              nodesConnectable={false}
            />
          </ProcessOperationsProvider>
        </div>
      </div>
      <EditProcessDetailsDialog
        currentName={foundProcess.name}
        currentDescription={foundProcess.description}
        onSave={handleUpdateProcess}
        isOpen={isProcessDetailsDialogOpen}
        onClose={() => setIsProcessDetailsDialogOpen(false)}
      />
      <AreYouSureDialog
        isOpen={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        title="Delete Process"
        message={`Are you sure you want to delete the process "${foundProcess.name}" and all associated tasks? This action cannot be undone.`}
        onConfirm={() => handleDeleteProcess()}
      />
    </>
  )
}
