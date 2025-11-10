import {use, useState} from "react";
import {EmployeeContext} from "../Context/EmployeeContext/EmployeeContext.jsx";
import Card from "@mui/material/Card";
import {Link} from "react-router";

export default function EmployeeListPage() {
  const {employees} = use(EmployeeContext);

  return (
    <div>
      <Link to={"/"}>
        <button>
          Return to dashboard
        </button>
      </Link>

      <h1>Employee list</h1>
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
