import {TaskContext} from "../Context/TaskContext/TaskContext.jsx";
import {useContext, useState, useMemo} from "react";
import TaskItem from "./TaskItem.jsx";
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import '../style/DetailPanel.css'

/**
 * @component TaskListPage
 * @description Displays a list of tasks fetched from `TaskContext` and provides a
 * filter input for searching by task name. This behavior mirrors the
 * filtering implementation used in `TagListPage` and `ProcessListPage`.
 * @returns {React.JSX.Element} The rendered TaskListPage component.
 */
export default function TaskListPage() {
  const {tasks} = useContext(TaskContext);
  const [filterString, setFilterString] = useState("");

  const filtered = useMemo(() => {
    const query = (filterString || "").trim().toLowerCase();
    const list = (tasks || []);
    if (!query) return list;
    return list.filter(task => {
      return task.name?.toLowerCase().includes(query);
    });
  }, [tasks, filterString]);

  return (
    <>
      <div className={"detail-container"}>
        <div className={"detail-header"}>
          <h2>Tasks</h2>
        </div>
        <div className="detail-actions-container">
          <TextField
            value={filterString}
            onChange={(e) => setFilterString(e.target.value)}
            placeholder="Search by name"
            size="small"
            color="white"
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                backgroundColor: 'white',
                borderRadius: 3,
              },
            }}
          />
        </div>

        {filtered.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No tasks found"
              secondary={filterString ? `No tasks match "${filterString}".` : "There are currently no tasks to display."}
            />
          </ListItem>
        ) : (
          <div>
            <ul>
              {filtered.map((task) => (
                <li key={task.name}>
                  <TaskItem taskId={task.id}/>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
