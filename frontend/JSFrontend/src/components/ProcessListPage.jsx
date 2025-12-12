import ProcessItem from "./ProcessItem.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {useContext, useState, useMemo} from "react";
import '../style/DetailPanel.css'
import AddProcessDialog from "./AddProcessDialog.jsx";
import {TextField, Paper, List, ListItem, ListItemText, Divider} from "@mui/material";

/**
 * @component ProcessListPage
 * @description Displays a list of processes fetched from `ProcessContext` and provides a
 * filter input for searching by process name. This behavior mirrors the
 * filtering implementation used in `TagListPage` and `TaskListPage`.
 * @returns {JSX.Element} The rendered ProcessListPage component.
 */
export default function ProcessListPage() {
  const {processes, addProcess} = useContext(ProcessContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterString, setFilterString] = useState("");

  const filtered = useMemo(() => {
    const query = (filterString || "").trim().toLowerCase();
    const list = (processes || []);
    if (!query) return list;
    return list.filter(p => p.name?.toLowerCase().includes(query));
  }, [processes, filterString]);

  /**
   * @function handleAddProcess
   * @description Handles the addition of a new process.
   * Validates the input and calls the addProcess function from ProcessContext.
   * Resets the input fields and closes the dialog upon successful addition.
   */
  function handleAddProcess(name, description) {
    try {
      addProcess(name, description);
    } catch (error) {
      console.error("Error adding process:", error);
    }
  }

  if ((processes || []).length === 0) {
    return (
      <>
        <div className={"detail-container"}>
          <div className={'detail-header'}>
            <h2>Processes</h2>
          </div>
          <div className={'detail-actions-container'}>
            <button className="add-button" onClick={() => setIsDialogOpen(true)}>Add process</button>
          </div>
          <div>
            <p>No processes available. Click "Add process" to create one.</p>
          </div>
        </div>
        <AddProcessDialog
          isOpen={isDialogOpen}
          onSave={(name, description) => handleAddProcess(name, description)}
          onClose={() => setIsDialogOpen(false)}
        />
      </>
    )
  }

  return (
    <>
      <div className={"detail-container"}>
        <div className={'detail-header'}>
          <h2>Processes</h2>
        </div>
        <div className={'detail-actions-container'}>
          <button className='add-button' onClick={() => setIsDialogOpen(true)}>Add Process</button>
          <TextField
            value={filterString}
            onChange={(e) => setFilterString(e.target.value)}
            placeholder="Search by name"
            size="small"
            color="white"
            sx={{
              width: '50%',
              mx: 'auto',
              display: 'block',
              '& .MuiInputBase-root': {
                backgroundColor: 'white',
                borderRadius: 3,
              },
            }}
          />
        </div>
        <div>
          {filtered.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No processes found"
                secondary={filterString ? `No processes match "${filterString}".` : "There are currently no processes to display."}
              />
            </ListItem>
          ) : (
            <div>
              <ul>
                {filtered.map((process) => (
                  <li key={process.name}>
                    <ProcessItem id={process.id}/>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <AddProcessDialog
        isOpen={isDialogOpen}
        onSave={(name, description) => handleAddProcess(name, description)}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}
