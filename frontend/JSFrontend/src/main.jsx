import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ProcessProvider} from "./Context/ProcessContext/ProcessProvider.jsx";
import {TaskProvider} from "./Context/TaskContext/TaskProvider.jsx"
import {EmployeeProvider} from "./Context/EmployeeContext/EmployeeProvider.jsx"
import {TagProvider} from "./Context/TagContext/TagProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*TODO: refactor context providers placement (?)*/}
    <ProcessProvider>
      <TaskProvider>
        <EmployeeProvider>
          <TagProvider>
            <App/>
          </TagProvider>
        </EmployeeProvider>
      </TaskProvider>
    </ProcessProvider>
  </StrictMode>,
)
