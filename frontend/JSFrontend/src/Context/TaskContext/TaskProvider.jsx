import {use, useState, useEffect} from "react";
import {TaskContext} from "./TaskContext.jsx";
import {ProcessContext} from "../ProcessContext/ProcessContext.jsx";
import axios from "axios";

export function TaskProvider({children}) {
  const BASE_URL = "http://localhost:8080/api/";
  const [tasks, setTasks] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      console.log("initializing tasks");
      initializeTasksFromDB();
    } else {
      console.log("Tasks already initialized");
    }
  });

  /**
   * @function initializeTasksFromDB
   * @description Initializes tasks from the database by fetching all tasks and setting the local state.
   * Sets the initialized state to true once done.
   * @returns {Promise<void>} A promise that resolves when the tasks are fetched and set
   */
  async function initializeTasksFromDB() {
    try {
      console.log("Initializing tasks from DB");
      await fetchAllTasks();
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching tasks from DB:", error);
    }
  }

  /**
   * @function fetchAllTasks
   * @description Fetches all tasks from the database and sets the local state.
   * @returns {Promise<void>} A promise that resolves when the tasks are fetched and set
   */
  async function fetchAllTasks() {
    try {
      console.log("Fetching all tasks from DB");
      const response = await axios.get(`${BASE_URL}tasks`);
      console.log(response);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks from DB:", error);
    }
  }

  /**
   * @function addTask
   * @description Adds a new task to the database and updates the local state.
   * @param processId The ID of the process to which the task belongs.
   * @param name The name of the task.
   * @param description The description of the task.
   * @returns {Promise<void>} A promise that resolves when the task is added and the state is updated.
   */
  async function addTask(processId, name, description) {
    try {
      const response = await axios.post(`${BASE_URL}tasks?processId=${processId}`, {
        processId: processId,
        taskName: name,
        taskDescription: description || null,
      });
      console.log(response.data);
      setTasks([...tasks, response.data]);
      //TODO: hack to refresh tasks in process, rewrite
      await fetchAllTasks()
    } catch (error) {
      console.error("Error adding task to DB:", error);
    }
  }


  function deleteTask(taskId) {
    setTasks(tasks.filter(task => task.id !== taskId));
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      deleteTask,
      fetchAllTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}
