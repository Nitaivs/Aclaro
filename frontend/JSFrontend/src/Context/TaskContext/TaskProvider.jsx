import {useState, useEffect} from "react";
import {TaskContext} from "./TaskContext.jsx";
import axios from "axios";

/**
 * @Component TaskProvider
 * @description Provides task-related state and functions to its children via TaskContext.
 * @param children The child components that will have access to the task context.
 * @returns {JSX.Element} The TaskProvider component.
 */
export function TaskProvider({children}) {
    const BASE_URL = "/api/";
  const [tasks, setTasks] = useState([]);
  const [initialized, setInitialized] = useState(false);

  //TODO: improve error handling across all functions

  /**
   * Effect hook that initializes tasks from the database when the component mounts.
   */
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
      console.log(`Tasks:`, response.data)
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks from DB:", error);
    }
  }

  /**
   * @function addTask
   * @description Adds a new task to the database and updates the local state.
   * @param processId The ID of the process to which the task belongs. Required.
   * @param name The name of the task. Required.
   * @param description The description of the task. Default is null.
   * @param parentTaskId The ID of the parent task, if any. Default is null.
   * @returns {Promise<void>} A promise that resolves when the task is added and the state is updated.
   */
  async function addTask(processId, name, description = null, parentTaskId = null) {
    if (!processId || !name) {
      console.error("Process ID and task name are required to add a task.");
      //TODO: throw error to inform user
      return;
    }
    try {
      console.log("Adding task to DB with processId:", processId, "name:", name, "description:", description, "parentTaskId:", parentTaskId);
      const response = await axios.post(`${BASE_URL}tasks?processId=${processId}`, {
        processId: processId,
        name,
        description,
        parentTaskId: parentTaskId
      });
      console.log("added task", response);
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
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
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
      // Re-throw the error to inform the caller
      throw error;
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
