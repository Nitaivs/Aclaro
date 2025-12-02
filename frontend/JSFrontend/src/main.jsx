import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ProcessProvider} from "./Context/ProcessContext/ProcessProvider.jsx";
import {TaskProvider} from "./Context/TaskContext/TaskProvider.jsx"
import {EmployeeProvider} from "./Context/EmployeeContext/EmployeeProvider.jsx"
import {TagProvider} from "./Context/TagContext/TagProvider.jsx";
import {DataProvider} from "./Context/DataContext/DataProvider.jsx";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {ConnectionProvider} from "./Context/ConnectionContext/ConnectionProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*TODO: refactor context providers placement (?)*/}
    <ToastContainer />
    <ConnectionProvider>
    <DataProvider>
      <TaskProvider>
        <ProcessProvider>
          <EmployeeProvider>
            <TagProvider>
              <App/>
            </TagProvider>
          </EmployeeProvider>
        </ProcessProvider>
      </TaskProvider>
    </DataProvider>
    </ConnectionProvider>
  </StrictMode>,
)
