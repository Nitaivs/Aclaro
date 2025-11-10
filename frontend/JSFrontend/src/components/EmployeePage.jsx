import {Link} from "react-router";
import {use, useEffect, useState} from 'react';
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";
import {useParams} from "react-router";

/**
 * @component EmployeePage
 * @description A page that displays the employeelist component
 * @returns {JSX.Element} The rendered EmployeePage component.
 */
export default function EmployeePage() {
  const {employees} = use(EmployeeContext);
  const {employeeId} = useParams();
  const parsedEmployeeId = employeeId ? parseInt(employeeId) : undefined;
  const foundEmployee = employees.find(e => e.id === parseInt(employeeId));

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
}