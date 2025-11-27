import { useState, useEffect } from "react";
import { DataContext } from "./DataContext.jsx";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

/**
 * @Component DataProvider
 * @description Provides state and function related to processes and tasks to its children via DataContext.
 * @param children The child components that will have access to the data context.
 * @returns {JSX.Element} The DataProvider component.
 */
export function DataProvider({ children }) {
  const [processes, setProcesses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initializeData();
    }
  }, [initialized]);

  async function initializeData() {
    try {
      console.log("Initializing data from DB");
      await Promise.all([fetchAllProcesses(), fetchAllTasks()]);
      setInitialized(true);
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  async function fetchAllProcesses() {
    try {
      const response = await axios.get(`${BASE_URL}processes`);
      console.log("Processes:", response.data);
      setProcesses(response.data);
    } catch (error) {
      console.error("Error fetching processes:", error);
    }
  }

  async function fetchAllTasks() {
    try {
      const response = await axios.get(`${BASE_URL}tasks`);
      console.log("Tasks:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function fetchProcessById(processId) {
    try {
      const response = await axios.get(`${BASE_URL}processes/${processId}`);
      const existingProcess = processes.find(p => p.id === processId);
      if (existingProcess) {
        setProcesses(processes.map(p => p.id === processId ? response.data : p));
      } else {
        setProcesses([...processes, response.data]);
      }
    } catch (error) {
      console.error("Error fetching process by ID:", error);
    }
  }

  async function addTaskBetweenTasks(processId, name, description, parentTaskId, childTaskId) {
    try {
      const response = await axios.post(
        `${BASE_URL}tasks/insert-between?parentTaskId=${parentTaskId}&childTaskId=${childTaskId}`,
        { name, description }
      );

      setTasks(prevTasks => [...prevTasks, response.data]);
      await fetchProcessById(processId);
    } catch (error) {
      console.error("Error adding task between tasks:", error);
      throw error;
    }
  }

  const value = {
    processes,
    tasks,
    setProcesses,
    setTasks,
    fetchAllProcesses,
    fetchAllTasks,
    fetchProcessById,
    addTaskBetweenTasks
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
