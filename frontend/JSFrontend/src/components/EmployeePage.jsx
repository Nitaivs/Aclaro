import { Link } from "react-router";
import { useContext, useEffect, useState } from 'react';
import { EmployeeContext } from "../Context/EmployeeContext/EmployeeContext.jsx";
import EmployeeList from "./EmployeeList.jsx";


/**
 * @component EmployeePage
 * @description A page that displays the employeelist component
 * @returns {JSX.Element} The rendered EmployeePage component.
 */
export default function EmployeePage() {

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