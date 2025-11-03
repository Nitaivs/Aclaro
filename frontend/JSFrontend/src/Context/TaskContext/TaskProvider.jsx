import {useState, useEffect} from "react";
import {TaskContext} from "./TaskContext.jsx";
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

  /**
   * @function updateTask
   * @description Updates an existing task in the database and updates the local state.
   * @param taskId The ID of the task to update.
   * @param updatedFields An object containing the fields to update.
   * @returns {Promise<void>} A promise that resolves when the task is updated and the state is updated.
   */
  async function updateTask(taskId, updatedFields) {
    try {
      console.log("Updating task with ID:", taskId, "with fields:", updatedFields);
      const response = await axios.put(`${BASE_URL}tasks/${taskId}`, updatedFields);
      console.log("Updated task:", response.data);
      setTasks(tasks.map(t => t.taskId === taskId ? response.data : t));
    } catch (error) {
      console.error("Error updating task in DB:", error);
    }
  }

  /**
   * @function deleteTask
   * @description Deletes a task from the database and updates the local state.
   * @param taskId The ID of the task to delete.
   * @returns {Promise<void>} A promise that resolves when the task is deleted and the state is updated.
   */
  async function deleteTask(taskId) {
    try {
      console.log("Deleting task with ID:", taskId);
      await axios.delete(`${BASE_URL}tasks/${taskId}`);
      setTasks(tasks.filter(t => t.taskId !== taskId));
      //TODO: hack to refresh tasks in process, rewrite
      await fetchAllTasks();
    } catch (error) {
      console.error("Error deleting task from DB:", error);
    }
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      deleteTask,
      updateTask,
      fetchAllTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}
