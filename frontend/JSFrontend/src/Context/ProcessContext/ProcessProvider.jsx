import {useEffect, useState} from "react";
import {ProcessContext} from "./ProcessContext.jsx";
import axios from "axios";

/**
 * ProcessProvider component that provides process-related state and functions to its children.
 * @param children The child components that will have access to the process context.
 * @returns {JSX.Element} The ProcessProvider component.
 */
export function ProcessProvider({children}) {
  const [processes, setProcesses] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const BASE_URL = "http://localhost:8080/api/";
  //TODO: move BASE_URL to config file

  /**
   * Effect hook that initializes processes from the database when the component mounts.
   */
  useEffect(() => {
    if (!initialized) {
      console.log("initializing processes");
      initializeProcessesFromDB();
    } else {
      console.log("Processes already initialized");
    }
  }, [initialized]);

  /**
   * @function initializeProcessesFromDB
   * @description Initializes processes from the database by fetching all processes and setting the local state.
   * Sets the initialized state to true once done.
   * @returns {Promise<void>} A promise that resolves when the processes are fetched and set
   */
  async function initializeProcessesFromDB() {
    try {
      console.log("Initializing processes from DB");
      await fetchAllProcesses()
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching processes from DB:", error);
    }
  }

  /**
   * @function fetchAllProcesses
   * @description Fetches all processes from the database and sets the local state.
   * @returns {Promise<void>} A promise that resolves when the processes are fetched and set
   */
  async function fetchAllProcesses() {
    try {
      console.log("Fetching all processes from DB");
      const response = await axios.get(`${BASE_URL}processes`);
      console.log(response);
      setProcesses(response.data);
    } catch (error) {
      console.error("Error fetching processes from DB:", error);
    }
  }

  /**
   * @function fetchProcessById
   * @description Fetches a process by its ID from the database and updates the local state.
   * @param processId the ID of the process to fetch
   * @returns {Promise<void>} A promise that resolves when the process is fetched and the state is updated
   */
  async function fetchProcessById(processId) {
    try {
      console.log("Fetching process by ID from DB:", processId);
      const response = await axios.get(`${BASE_URL}processes/${processId}`);
      console.log("Fetched process:", response.data);
      const existingProcess = processes.find(p => p.processId === processId);
      if (existingProcess) {
        setProcesses(processes.map(p => p.processId === processId ? response.data : p));
        return;
      }
      setProcesses([...processes, response.data]);
    } catch (error) {
      console.error("Error fetching process by ID from DB:", error);
    }
  }


  /**
   * @function deleteTaskIdFromProcess
   * @description Deletes a task ID from a process's taskIds array in the local state.
   * @param processId the ID of the process
   * @param taskId the ID of the task to delete
   */
  function deleteTaskIdFromProcess(processId, taskId) {
    const foundProcess = processes.find(p => p.processId === processId);
    if (!foundProcess) {
      console.error("Process not found:", processId);
      return;
    }
    const updatedTaskIds = foundProcess.taskIds.filter(id => id !== taskId);
    const updatedProcess = {...foundProcess, taskIds: updatedTaskIds};
    setProcesses(processes.map(p => p.processId === processId ? updatedProcess : p));
  }

  /**
   * @function addProcess
   * @description Sends a POST request to add a new process to the database and updates the local state.
   * @param name the name of the new process
   * @param description the description of the new process
   * @returns {Promise<void>} A promise that resolves when the process is added
   */
  async function addProcess(name, description) {
    try {
      console.log("Adding process to DB");
      const response = await axios.post(`${BASE_URL}processes`, {
        processName: name,
        processDescription: description
      });
      const newProcess = response.data;
      console.log("Process added to DB:", newProcess);
      newProcess.taskIds = [];
      setProcesses([...processes, newProcess]);
      console.log("Process added locally:", newProcess);
    } catch (error) {
      console.error("Error adding process to DB:", error);
    }
  }

  /**
   * @function deleteProcess
   * @description Sends a DELETE request to remove a process from the database and updates the local state.
   * @param processId the ID of the process to delete
   * @returns {Promise<void>} A promise that resolves when the process is deleted
   */
  async function deleteProcess(processId) {
    try {
      console.log("Deleting process from DB");
      await axios.delete(`${BASE_URL}processes/${processId}`);
      console.log("Process deleted from DB:", processId);
    } catch (error) {
      console.error("Error deleting process from DB:", error);
    }
    setProcesses(processes.filter(process => process.processId !== processId));
  }

  /**
   * @function updateProcess
   * @description Sends a PUT request to update a process in the database and updates the local state.
   * @param processId the ID of the process to update
   * @param updatedFields an object containing the fields to update
   * @returns {Promise<void>} A promise that resolves when the process is updated
   */
  async function updateProcess(processId, updatedFields) {
    try {
      const foundProcess = processes.find(p => p.processId === processId);
      if (!foundProcess) {
        console.error("Process not found:", processId);
        return;
      }
      console.log("Updating process:", updatedFields);
      const response = await axios.put(`${BASE_URL}processes/${processId}`, updatedFields);
      console.log("response:", response.data);
      //TODO: replace with response data once backend updates description
      const updatedProcess = {...foundProcess, ...updatedFields};
      setProcesses(processes.map(p => p.processId === processId ? updatedProcess : p));
    } catch (error) {
      console.error("Error updating process in DB:", error);
    }
  }

  return (
    <ProcessContext value={{
      processes,
      addProcess,
      deleteProcess,
      updateProcess,
      initializeProcessesFromDB,
      fetchAllProcesses,
      fetchProcessById,
      deleteTaskIdFromProcess
    }}>
      {children}
    </ProcessContext>
  )
}
