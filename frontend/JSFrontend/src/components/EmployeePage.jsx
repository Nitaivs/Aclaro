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

    return (
        <div>
            <h1>Employee Page</h1>
            <Link to="/">
                <button>
                    Go back
                </button>
            </Link>
            <EmployeeList />
        </div>
    );
}