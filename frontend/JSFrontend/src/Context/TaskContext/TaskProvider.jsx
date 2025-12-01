import { use } from "react";
import { TaskContext } from "./TaskContext.jsx";
import { DataContext } from "../DataContext/DataContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "/api/";

/**
 * @Component TaskProvider
 * @description Provides state and functions related to tasks to its children via TaskContext.
 * @param {Object} props The component props.
 * @param {JSX.Element} props.children The child components that will have access to the task context.
 * @returns {JSX.Element} The TaskProvider component.
 */
export function TaskProvider({ children }) {
    const { tasks, setTasks, fetchAllTasks, addTaskBetweenTasks } = use(DataContext);

    /**
     * @function addTask
     * @description Adds a new task to a process. Makes a POST request to the backend with the task details,
     * then fetches all tasks to update the state.
     * @param {Number} processId - The ID of the process to which the task will be added. Expected to be an integer. Required.
     * @param {string} name - The name of the new task. Required.
     * @param {string} description - The description of the new task. Optional.
     * @param toast - Toast notification instance for displaying messages.
     * @param parentTaskId - The ID of the parent task, if this task is a subtask. Optional.
     * @returns {Promise<void>} A promise that resolves when the task is added and tasks are fetched.
     */
    async function addTask(processId, name, description = null, parentTaskId = null) {
        try {
            if (!processId) {
                throw new Error("Process ID is required to add a task.");
            }

            if (!name) {
                throw new Error("Task name is required.");
            }

            if (parentTaskId !== null && isNaN(parentTaskId)) {
                throw new Error("Provided parentTaskId is not a valid number.");
            }

            await axios.post(`${BASE_URL}tasks?processId=${processId}`, {
                processId,
                name,
                description,
                parentTaskId
            });
            await fetchAllTasks();
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    }

    /**
     * @function updateTask
     * @description Updates an existing task with new fields. Makes a PUT request to the backend,
     * then updates the task in the state.
     * @param toast - Toast notification instance for displaying messages.
     * @param {Number} taskId - The ID of the task to be updated. Expected to be an integer. Required.
     * @param {Object} updatedFields - An object containing the fields to be updated. Required.
     * @returns {Promise<void>} A promise that resolves when the task is updated.
     */
    async function updateTask(taskId, updatedFields) {
        try {
            const response = await axios.put(`${BASE_URL}tasks/${taskId}`, updatedFields);
            setTasks(tasks.map(t => t.id === taskId ? response.data : t));
        } catch (error) {
            console.error("Error updating task:", error);
            if (error.response && error.response.status === 404) {
                toast.error("Task not found. It may have been deleted or edited. Refresh the page.");
            }
            toast.error ("Backend failure. Please refresh the page and try again.");
        }
    }

    /**
     * @function deleteTask
     * @description Deletes a task by its ID. Makes a DELETE request to the backend,
     * and then fetches all tasks to update the state.
     * @param toast - Toast notification instance for displaying messages.
     * @param {Number} taskId - The ID of the task to be deleted. Expected to be an integer. Required.
     * @returns {Promise<void>} A promise that resolves when the task is deleted and tasks are fetched.
     */
    async function deleteTask(taskId) {
        try {
            await axios.delete(`${BASE_URL}tasks/${taskId}`);
            await fetchAllTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
            if (error.response && error.response.status === 404) {
                toast.error("Task not found. It may have been deleted or edited. Refresh the page.");
            }
            toast.error ("Backend failure. Please refresh the page and try again.");
        }
    }

    return (
        <TaskContext.Provider value={{
            tasks,
            addTask,
            updateTask,
            deleteTask,
            addTaskBetweenTasks,
            fetchAllTasks
        }}>
            {children}
        </TaskContext.Provider>
    );
}
