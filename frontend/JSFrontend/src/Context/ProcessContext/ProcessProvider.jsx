import {use} from "react";
import {ProcessContext} from "./ProcessContext.jsx";
import {DataContext} from "../DataContext/DataContext.jsx";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

/**
 * @Component ProcessProvider
 * @description Provides state and functions related to processes to its children via ProcessContext.
 * @param {Object} props - The component props.
 * @param {JSX.Element} children - The child components that will have access to the process context.
 * @returns {JSX.Element} The ProcessProvider component.
 * @constructor
 */
export function ProcessProvider({children}) {
  const {processes, setProcesses, fetchAllTasks, fetchProcessById} = use(DataContext);

  /**
   * @function addProcess
   * @description Adds a new process. Makes a POST request to the backend with the process details,
   * then updates the state with the new process.
   * @param {string} name - The name of the new process. Required.
   * @param {string} description - The description of the new process. Optional.
   * @returns {Promise<void>} A promise that resolves when the process is added.
   */
  async function addProcess(name, description) {
    try {
      const response = await axios.post(`${BASE_URL}processes`, {
        name,
        description
      });
      const newProcess = {...response.data, taskIds: []};
      setProcesses([...processes, newProcess]);
    } catch (error) {
      console.error("Error adding process:", error);
      throw error;
    }
  }

  /**
   * @function deleteProcess
   * @description Deletes a process by its ID. Makes a DELETE request to the backend,
   * then updates the state to remove the deleted process and fetches all tasks.
   * @param {Number} processId - The ID of the process to delete. Expected to be an integer. Required.
   * @returns {Promise<void>} A promise that resolves when the process is deleted and tasks are fetched.
   */
  async function deleteProcess(processId) {
    try {
      await axios.delete(`${BASE_URL}processes/${processId}`);
      setProcesses(processes.filter(p => p.id !== processId));
      await fetchAllTasks();
    } catch (error) {
      console.error("Error deleting process:", error);
      throw error;
    }
  }

  /**
   * @function updateProcess
   * @description Updates an existing process with new fields. Makes a PUT request to the backend,
   * then updates the process in the state.
   * @param {Number} processId - The ID of the process to be updated. Expected to be an integer. Required.
   * @param {Object} updatedFields - An object containing the fields to be updated. Required.
   * @returns {Promise<void>} A promise that resolves when the process is updated.
   */
  async function updateProcess(processId, updatedFields) {
    try {
      const response = await axios.put(`${BASE_URL}processes/${processId}`, updatedFields);
      setProcesses(processes.map(p => p.id === processId ? response.data : p));
    } catch (error) {
      console.error("Error updating process:", error);
      throw error;
    }
  }

  /**
   * @function deleteTaskIdFromProcess
   * @description Deletes a task ID from a process's taskIds array in the state.
   * @param {Number} processId - The ID of the process from which to delete the task ID. Expected to be an integer. Required.
   * @param {Number} taskId - The task ID to delete from the process's taskIds array. Expected to be an integer. Required.
   */
  function deleteTaskIdFromProcess(processId, taskId) {
    setProcesses(processes.map(p =>
      p.id === processId
        ? {...p, taskIds: p.taskIds.filter(id => id !== taskId)}
        : p
    ));
  }

  return (
    <ProcessContext.Provider value={{
      processes,
      addProcess,
      deleteProcess,
      updateProcess,
      deleteTaskIdFromProcess,
      fetchProcessById
    }}>
      {children}
    </ProcessContext.Provider>
  );
}
