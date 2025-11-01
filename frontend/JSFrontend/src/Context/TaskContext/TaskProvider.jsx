import {use, useState, useEffect} from "react";
import {TaskContext} from "./TaskContext.jsx";
import {ProcessContext} from "../ProcessContext/ProcessContext.jsx";
import axios from "axios";

export function TaskProvider({children}) {
  const BASE_URL = "http://localhost:8080/api/";
  const [tasks, setTasks] = useState([]);
  const [initialized, setInitialized] = useState(false);
  // const {processes, setProcesses} = use(ProcessContext);


  useEffect(() => {
    if (!initialized) {
      console.log("initializing tasks");
      initializeTasksFromDB();
    } else {
      console.log("Tasks already initialized");
    }
  });

  async function initializeTasksFromDB() {
    try {
      console.log("Initializing tasks from DB");
      const response = await axios.get(`${BASE_URL}tasks`);
      console.log(response);
      setTasks(response.data);
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching tasks from DB:", error);
    }
  }

  async function addTask(processId, name, description) {
    try {
      const response = await axios.post(`${BASE_URL}tasks?processId=${processId}`, {
        processId: processId,
        taskName: name,
        taskDescription: description || null,
      });
      console.log(response.data);
      setTasks([...tasks, response.data]);
      // const foundProcess = processes.find(p => p.processId === processId);
      // if (foundProcess) {
      //   foundProcess.taskIds.push(response.data.id);
      //   setProcesses([...processes.filter(p => p.processId !== processId), foundProcess]);
      // }
    } catch (error) {
      console.error("Error adding task to DB:", error);
    }
  }


  function deleteTask(taskId) {
    setTasks(tasks.filter(task => task.id !== taskId));
  }

  return (
    <TaskContext.Provider value={{tasks, addTask, deleteTask}}>
      {children}
    </TaskContext.Provider>
  );
}
