import {Link} from "react-router";
import {use, useState} from 'react';
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";
import {useParams} from "react-router";
import EditEmployeeDialog from "./EditEmployeeDialog.jsx";

/**
 * @component EmployeePage
 * @description A page that displays the employee's details.
 * @returns {JSX.Element} The rendered EmployeePage component.
 */
export default function EmployeePage() {
  const {employees, updateEmployee} = use(EmployeeContext);
  const {employeeId} = useParams();
  const parsedEmployeeId = employeeId ? parseInt(employeeId) : undefined;
  const foundEmployee = employees.find(e => e.id === parseInt(employeeId));
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);

  function handleUpdateEmployee(newFirstName, newLastName) {
    updateEmployee(parsedEmployeeId, {firstName: newFirstName, lastName: newLastName});
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
      <h1>{foundEmployee.firstName} {foundEmployee.lastName}</h1>
      <button onClick={() => setIsEditEmployeeDialogOpen(true)}>
        Edit Employee
      </button>
      <EditEmployeeDialog
        currentFirstName={foundEmployee.firstName}
        currentLastName={foundEmployee.lastName}
        isOpen={isEditEmployeeDialogOpen}
        onClose={() => setIsEditEmployeeDialogOpen(false)}
        onSave={handleUpdateEmployee}
      />
    </div>
  );
}
