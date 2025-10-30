import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ProcessContextProvider from "./Context/ProcessContext/ProcessContextProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ProcessContextProvider>
            <App/>
        </ProcessContextProvider>
    </StrictMode>,
)
