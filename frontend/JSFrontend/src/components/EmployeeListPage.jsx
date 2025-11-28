import {useContext, useState} from "react";
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";
import AddEmployeeDialog from "./AddEmployeeDialog.jsx";
import {Link} from "react-router";
import {
  Alert,
  AlertTitle,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import EmployeeItem from "./EmployeeItem.jsx";

/**
 * @component EmployeeListPage
 * @description A page component that displays a list of employees.
 * It retrieves the employee data from EmployeeContext and renders each employee's name inside a Card component.
 * @returns {JSX.Element} The rendered EmployeeListPage component.
 */
export default function EmployeeListPage() {
  const {employees, addEmployee, deleteEmployeeById} = useContext(EmployeeContext);
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterString, setFilterString] = useState("");
  const [removeMode, setRemoveMode] = useState(false);

  // Filter employees based on the filterString
  const filtered = employees.filter(emp => `
    ${emp?.firstName || ''} ${emp?.lastName || ''}`.toLowerCase().includes(filterString.trim().toLowerCase())
  );

  /**
   * @function handleAddEmployee
   * @description Handles the addition of a new employee.
   * Calls the addEmployee function from EmployeeContext and manages error handling.
   * @param firstName - The first name of the new employee.
   * @param lastName - The last name of the new employee.
   * @returns {Promise<void>} A promise that resolves when the employee is added or an error occurs.
   */
  async function handleAddEmployee(firstName, lastName) {
    try {
      await addEmployee(firstName, lastName);
    } catch (error) {
      console.error("Error adding employee:", error);
      setErrorMessage(error.message)
      setShowErrorAlert(true);
    }
  }

  /**
   * @function handleDeleteEmployee
   * @description Handles the deletion of an employee.
   * Calls the deleteEmployeeById function from EmployeeContext and manages error handling.
   * @param id - The ID of the employee to delete.
   * @returns {Promise<void>} A promise that resolves when the employee is deleted or an error occurs.
   */
  async function handleDeleteEmployee(id) {
    console.log(id);
    try {
      await deleteEmployeeById(id);
    } catch (error) {
      console.error("Error deleting employee:", error);
      setErrorMessage(error.message || String(error));
      setShowErrorAlert(true);
    }
  }

  return (
    <div>
      <h1>Employee list</h1>
      <button onClick={() => setIsAddEmployeeDialogOpen(true)}>
        Add employee
      </button>
      <button onClick={() => setRemoveMode(!removeMode)}>
        {removeMode ? "Exit" : "Remove Employees"}
      </button>

      <AddEmployeeDialog
        isOpen={isAddEmployeeDialogOpen}
        onSave={handleAddEmployee}
        onClose={() => setIsAddEmployeeDialogOpen(false)}
      />

      <Collapse in={showErrorAlert}>
        <Alert sx={{width: '100%'}} title="Error" severity="error" onClose={() => setShowErrorAlert(false)}>
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      </Collapse>

      {/* Search Field */}
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
                primary="No employees found"
                secondary={filterString ? `No employees match "${filterString}".` : "There are currently no employees to display."}
              />
            </ListItem>
          ) : (
            filtered.map((emp, idx) => {
              return (
                <div key={emp.id ?? idx}>
                    <ListItem alignItems="flex-start">
                      <EmployeeItem employeeId={emp.id}/>
                    </ListItem>
                    {idx < filtered.length - 1 && <Divider component="li"/>}
                </div>
              );
            })
          )}
        </List>
      </Paper>
    </div>
  )
}
