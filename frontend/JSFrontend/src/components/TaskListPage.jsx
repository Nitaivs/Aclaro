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
        <TextField
          value={filterString}
          onChange={(e) => setFilterString(e.target.value)}
          placeholder="Search by name"
          fullWidth
          size="small"
          color="white"
          sx={{
            mb: 1,
            '& .MuiInputBase-root': {
              backgroundColor: 'white',
              borderRadius: 1,
            },
          }}
        />

        <Paper variant="outlined" sx={{p: 1}}>
          <List>
            {filtered.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No tasks found"
                  secondary={filterString ? `No tasks match "${filterString}".` : "There are currently no tasks to display."}
                />
              </ListItem>
            ) : (
              filtered.map((task, idx) => (
                <div key={task.id}>
                  <ListItem alignItems="flex-start">
                    <TaskItem
                      taskId={task.id}
                    />
                  </ListItem>
                  {idx < filtered.length - 1 && <Divider component="li" />}
                </div>
              ))
            )}
          </List>
        </Paper>
      </div>
    </>
  )
}
