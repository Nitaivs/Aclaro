import { useContext } from "react";
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
    const { tasks, setTasks, fetchAllTasks, addTaskBetweenTasks } = useContext(DataContext);

    /**
     * @function addTask
     * @description Adds a new task to a process. Makes a POST request to the backend with the task details,
     * then fetches all tasks to update the state.
     * @param {Number} processId - The ID of the process to which the task will be added. Expected to be an integer. Required.
     * @param {string} name - The name of the new task. Required.
     * @param {string} description - The description of the new task. Optional.
     * @param parentTaskId - The ID of the parent task, if this task is a subtask. Optional.
     * @returns {Promise<void>} A promise that resolves when the task is added and tasks are fetched.
     */
    async function addTask(processId, name, description = null, parentTaskId = null) {
        try {
            if (!processId) {
                toast.error("No processId provided");
                return;
            }

            if (!name) {
                toast.error("Task name is required");
                return;
            }

            if (parentTaskId !== null && isNaN(parentTaskId)) {
                toast.error("parentTaskId must be a number or null");
                return;
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
            if (error.response && error.response.status === 400) {
                toast.error("Cannot add task. Invalid data provided.");
            } else {
                toast.error("Backend failure. Please refresh the page and try again.");
            }
        }
    }

    /**
     * @function updateTask
     * @description Updates the name and description of an existing task. Makes a PUT request to the backend,
     * then updates the task in the state.
     * @param {Number} taskId - The ID of the task to be updated. Expected to be an integer. Required.
     * @param {string} newName - The new name for the task. Required.
     * @param {string} newDescription - The new description for the task. Required.
     * @returns {Promise<void>} A promise that resolves when the task is updated.
     */
    async function updateTask(taskId, newName, newDescription) {
        try {
            console.debug("Updating task:", taskId, newName, newDescription);
            const response = await axios.put(`${BASE_URL}tasks/${taskId}`, {
                name: newName,
                description: newDescription
            });
            console.debug("Updating task:", response.data);
            setTasks(tasks.map(t => (t.id === taskId ? response.data : t)));
        } catch (error) {
            console.error("Error updating task:", error);
            if (error.response && error.response.status === 404) {
                toast.error("Task not found. It may have been deleted or edited. Refresh the page.");
            }
            toast.error("Backend failure. Please refresh the page and try again.");
        }
    }

    /**
     * @function updateTaskRequirements
     * @description Updates the department and skills required for a task.
     * Makes a PUT request to the backend to update the task's requirements.
     * @param {number} taskId - The ID of the task to be updated. Expected to be an integer. Required.
     * @param departmentId - The ID of the department required for the task. May be null to indicate no department requirement.
     * @param {Array<number>} skillIds - An array of skill IDs required for the task. IDs are expected to be integers. Required, but may be an empty array.
     * @returns {Promise<void>}
     */
    async function updateTaskRequirements(taskId, departmentIds, skillIds) {
        try {
            console.debug("Updating task requirements:", taskId, departmentIds, skillIds);
            const response = await axios.put(`${BASE_URL}tasks/${taskId}/requirements`, {
                departmentIds,
                skillIds
            });
            console.debug("Updated task requirements:", response.data);
            setTasks(tasks.map(t => (t.id === taskId ? response.data : t)));
        } catch (error) {
            console.error("Error updating task requirements:", error);
            if (error.response && error.response.status === 404) {
                toast.error("Task not found. It may have been deleted or edited. Refresh the page.");
            }
            toast.error("Backend failure. Please refresh the page and try again.");
        }
    }

    /**
     * @function deleteTask
     * @description Deletes a task by its ID. Makes a DELETE request to the backend,
     * and then fetches all tasks to update the state.
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
            } if (error.response && error.response.status === 409) {
                toast.error("Cannot delete task. A task under it is relying on it. Please remove any tasks linked to this task.");
            }
            toast.error("Backend failure. Please refresh the page and try again.");
        }
    }

    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                updateTask,
                updateTaskRequirements,
                deleteTask,
                addTaskBetweenTasks,
                fetchAllTasks
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}
