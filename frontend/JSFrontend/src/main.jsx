import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ProcessProvider} from "./Context/ProcessContext/ProcessProvider.jsx";
import {TaskProvider} from "./Context/TaskContext/TaskProvider.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProcessProvider>
      <TaskProvider>
        <App/>
      </TaskProvider>
    </ProcessProvider>
  </StrictMode>,
)
