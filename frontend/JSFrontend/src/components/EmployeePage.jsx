import {Link} from "react-router";
import {use, useEffect, useState} from 'react';
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";
import {useParams} from "react-router";
import EditEmployeeDialog from "./EditEmployeeDialog.jsx";

/**
 * @component EmployeePage
 * @description A page that displays the employeelist component
 * @returns {JSX.Element} The rendered EmployeePage component.
 */
export default function EmployeePage() {
  const {employees, updateEmployee} = use(EmployeeContext);
  const {employeeId} = useParams();
  const parsedEmployeeId = employeeId ? parseInt(employeeId) : undefined;
  const foundEmployee = employees.find(e => e.id === parseInt(employeeId));
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);

  function handleUpdateEmployee(updatedName) {
    updateEmployee(parsedEmployeeId, updatedName);
    setIsEditEmployeeDialogOpen(false);
  }

  if (!parsedEmployeeId) {
    return (
      <div>
        <h1>Employee Page</h1>
        <p>Error: Invalid employee ID.</p>
        <Link to="/employees">
          <button>
            Return to employee list
          </button>
        </Link>
      </div>
    );
  }

  if (!foundEmployee) {
    return (
      <div>
        <h1>Employee Page</h1>
        <p>Error: Employee with id: {parsedEmployeeId} not found.</p>
        <Link to="/employees">
          <button>
            Return to employee list
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/employees">
        <button>
          Return to employee list
        </button>
      </Link>
      <h2>Employee Page</h2>
      <h1>{foundEmployee.name}</h1>
      <button onClick={() => setIsEditEmployeeDialogOpen(true)}>
        Edit Employee
      </button>
      <EditEmployeeDialog
        currentName={foundEmployee.name}
        isOpen={isEditEmployeeDialogOpen}
        onClose={() => setIsEditEmployeeDialogOpen(false)}
        onSave={handleUpdateEmployee}
      />
    </div>
  );
}
