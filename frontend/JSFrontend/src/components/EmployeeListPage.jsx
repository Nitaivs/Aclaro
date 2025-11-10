import {use, useState} from "react";
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";
import AddEmployeeDialog from "./AddEmployeeDialog.jsx";
import {Link} from "react-router";
import {Card, Alert, AlertTitle} from "@mui/material";
import Collapse from "@mui/material/Collapse";

/**
 * @component EmployeeListPage
 * @description A page component that displays a list of employees.
 * It retrieves the employee data from EmployeeContext and renders each employee's name inside a Card component.
 * @returns {JSX.Element} The rendered EmployeeListPage component.
 */
export default function EmployeeListPage() {
  const {employees, addEmployee} = use(EmployeeContext);
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAddEmployee(name) {
    try {
      await addEmployee(name)
    } catch (error) {
      console.error("Error adding employee:", error);
      setErrorMessage(error.message)
      setShowErrorAlert(true);
    }
  }

  return (
    <div>
      <Link to={"/"}>
        <button>
          Return to dashboard
        </button>
      </Link>

      <h1>Employee list</h1>
      <button onClick={() => setIsAddEmployeeDialogOpen(true)}>
        Add employee
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

      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            <Card
              style={{margin: '10px', padding: '10px'}}
            >
              {employee.name}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
