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

  useEffect(() => {
    if (!initialized) {
      console.log("initializing processes");
      initializeProcessesFromDB();
    } else {
      console.log("Processes already initialized");
    }
  }, [initialized]);

  /**
   * Fetches all processes from the database and sets the local state.
   * @returns {Promise<void>} A promise that resolves when the processes are fetched and set
   */
  async function initializeProcessesFromDB() {
    try {
      console.log("Initializing processes from DB");
      const response = await axios.get(`${BASE_URL}processes`);
      //TODO: rewrite once default process fetch includes tasks
      for (const process of response.data) {
        const tasksResponse = await axios.get(`${BASE_URL}processes/${process.processId}/tasks`);
        process.taskIds = tasksResponse.data.taskIds;
      }
      setProcesses(response.data);
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching processes from DB:", error);
    }
  }

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
   * Sends a DELETE request to remove a process from the database and updates the local state.
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
   * Sends a PUT request to update a process in the database and updates the local state.
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
      initializeProcessesFromDB
    }}>
      {children}
    </ProcessContext>
  )
}
