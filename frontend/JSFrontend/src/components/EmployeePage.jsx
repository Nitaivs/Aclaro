import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { EmployeeContext } from "../Context/EmployeeContext/EmployeeContext.jsx";
import EmployeeList from "./EmployeeList.jsx";



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