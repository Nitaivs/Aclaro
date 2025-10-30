import {useState} from "react";
import {TaskContext} from "./TaskContext.jsx";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  function addTask() {
    const task = {
      id: tasks.length + 1,
      name: `Task ${tasks.length + 1}`,
      description: 'This is a new task'
    };
    setTasks([...tasks, task]);
  }

  function deleteTask(taskId) {
    setTasks(tasks.filter(task => task.id !== taskId));
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}
