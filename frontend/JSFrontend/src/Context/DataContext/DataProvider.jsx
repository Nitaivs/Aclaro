import {useState, useEffect} from "react";
import {DataContext} from "./DataContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

const BASE_URL = "http://localhost:8080/api/";

/**
 * @Component DataProvider
 * @description Provides state and function related to processes and tasks to its children via DataContext.
 * @param {JSX.Element} children - The child components that will have access to the data context.
 * @returns {JSX.Element} The DataProvider component.
 */
export function DataProvider({children}) {
  const [processes, setProcesses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initializeData();
    }
  }, [initialized]);

  /**
   * @function initializeData
   * @description Initializes the data by fetching all processes and tasks from the backend.
   * @returns {Promise<void>} A promise that resolves when the data is initialized.
   */
  async function initializeData() {
    try {
      console.log("Initializing data from DB");
      await Promise.all([fetchAllProcesses(), fetchAllTasks()]);
      setInitialized(true);
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  /**
   * @function fetchAllProcesses
   * @description Fetches all processes from the backend and updates the state.
   * @returns {Promise<void>} A promise that resolves when the processes are fetched.
   */
  async function fetchAllProcesses() {
    try {
      const response = await axios.get(`${BASE_URL}processes`);
      console.log("Processes:", response.data);
      setProcesses(response.data);
    } catch (error) {
      console.error("Error fetching processes:", error);
    }
  }

  /**
   * @function fetchAllTasks
   * @description Fetches all tasks from the backend and updates the state.
   * @returns {Promise<void>} A promise that resolves when the tasks are fetched.
   */
  async function fetchAllTasks() {
    try {
      const response = await axios.get(`${BASE_URL}tasks`);
      console.log("Tasks:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  /**
   * @function fetchProcessById
   * @description Fetches a process by its ID from the backend and updates the state.
   * @param {Number} processId - The ID of the process to fetch. Expected to be an integer. Required.
   * @returns {Promise<void>} A promise that resolves when the process is fetched.
   */
  async function fetchProcessById(processId) {
    try {
      const response = await axios.get(`${BASE_URL}processes/${processId}`);
      setProcesses(prevProcesses => {
        const existingProcess = prevProcesses.find(p => p.id === processId);
        if (existingProcess) {
          return prevProcesses.map(p => p.id === processId ? response.data : p);
        } else {
          return [...prevProcesses, response.data];
        }
      });
    } catch (error) {
      console.error("Error fetching process by ID:", error);
      if (error.response && error.response.status === 404) {
        toast.error(`Process with ID ${processId} not found.`);
      } else {
        toast.error(`Backend failure while fetching process with ID ${processId}.`);
      }
    }
  }

  /**
   * @function addTaskBetweenTasks
   * @description Adds a new task between two existing tasks in a process.
   * Makes a POST request to the backend, then fetches the updated process and all tasks.
   * @param {Number} processId - The ID of the process to which the task will be added. Expected to be an integer. Required.
   * @param {string} name - The name of the new task. Required.
   * @param {string} description - The description of the new task. Optional.
   * @param {Number} parentTaskId - The ID of the parent task after which the new task will be inserted. Required.
   * @param {Number} childTaskId - The ID of the child task before which the new task will be inserted. Required.
   * @returns {Promise<void>} A promise that resolves when the task is added and data is fetched.
   */
  async function addTaskBetweenTasks(processId, name, description, parentTaskId, childTaskId) {
    try {
      const response = await axios.post(
        `${BASE_URL}tasks/insert-between?parentTaskId=${parentTaskId}&childTaskId=${childTaskId}`,
        {name, description}
      );

      console.log("Added task: ", response.data);
      await fetchProcessById(processId);
      await fetchAllTasks();
    } catch (error) {
      console.error("Error adding task between tasks:", error);
      if (error.response && error.response.status === 400) {
        toast.error("Cannot add task: Invalid data provided.");
      } else {
        toast.error("Backend failure while adding task between tasks.");
      }
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
