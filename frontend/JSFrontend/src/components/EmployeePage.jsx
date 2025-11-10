import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { EmployeeContext } from "../Context/EmployeeContext/EmployeeContext.jsx";



export default function EmployeePage() {

    return (
        <div>
            <h1>Employee Page</h1>
            <h2>Nothing yet here, still being built</h2>
            <Link to="/">
                <button>
                    Go to Dashboard
                </button>
            </Link>
        </div>
    );
}