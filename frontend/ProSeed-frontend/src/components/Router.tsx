import {Route, Routes, BrowserRouter} from "react-router";
import Dashboard from "./Dashboard.tsx";
import ProcessPage from "./ProcessPage.tsx";
import TaskPage from "./TaskPage.tsx";

/**
 * @component Router
 * @description The Router component sets up the routing for the application using React Router.
 * It defines the routes to access other components.
 * @returns {JSX.Element} The Router component.
 */
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/process/:processId" element={<ProcessPage/>}/>
                <Route path="/process/:processId/task/:taskId" element={<TaskPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}
