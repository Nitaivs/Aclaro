import ProcessItem from "./ProcessItem.jsx";
import {ProcessContext} from "../Context/ProcessContext/ProcessContext.jsx";
import {use, useState} from "react";
import '../style/DetailPanel.css'
import AddProcessDialog from "./AddProcessDialog.jsx";

/**
 * @component ProcessListPage
 * @description A component that displays a list of processes.
 * Users can add new processes and each process is represented by a ProcessCard component.
 * @return {JSX.Element} The rendered ProcessListPage component.
 */
export default function ProcessListPage() {
  const {processes, addProcess} = use(ProcessContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  if (processes.length === 0) {
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
        </div>
        <div>
          <ul>
            {processes.map((process) => (
              <li key={process.id}>
                <ProcessItem id={process.id}/>
              </li>
            ))}
          </ul>
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
