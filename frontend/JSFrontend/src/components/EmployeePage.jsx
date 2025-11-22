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

  function handleUpdateEmployee(newFirstName, newLastName, newDepartment, skills) {
    if (newFirstName === foundEmployee.firstName && newLastName === foundEmployee.lastName) {
      setIsEditEmployeeDialogOpen(false);
      return;
    }
    updateEmployee(foundEmployee.id, {firstName: newFirstName, lastName: newLastName, department: newDepartment, skills: skills});
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

const skillsList = Array.isArray(foundEmployee.skills)
    ? foundEmployee.skills
            .map(s => (typeof s === 'string' ? s : s && s.name ? s.name : ''))
            .filter(Boolean)
            .join(', ')
    : (foundEmployee.skills || '');

return (
    <div>
        <Link to="/employees">
            <button>
                Return to employee list
            </button>
        </Link>
        <h2>Employee Page</h2>
        <h1>{foundEmployee.firstName} {foundEmployee.lastName}</h1>
        <p>Department: {foundEmployee.department?.name || "None"}</p>
        <p>Skills: {skillsList || "None"}</p>
        <button onClick={() => setIsEditEmployeeDialogOpen(true)}>
            Edit Employee
        </button>
        <EditEmployeeDialog
            currentFirstName={foundEmployee.firstName}
            currentLastName={foundEmployee.lastName}
            currentSkills={foundEmployee.skills}
            isOpen={isEditEmployeeDialogOpen}
            onClose={() => setIsEditEmployeeDialogOpen(false)}
            onSave={handleUpdateEmployee}
            currentDepartment={foundEmployee.department}
        />
    </div>
);
}
