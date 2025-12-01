import { ConnectionContext } from "./ConnectionContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

/**
 * @Component ConnectionProvider
 * @description Checks if the backend is down and throws a toast notification if so.
 * @param children The child components that will have access to the connection context.
 * @returns {JSX.Element} The ConnectionProvider component.
 */
export function ConnectionProvider({ children }) {
    const BASE_URL = "/api/";

    const getStatus = async () => {
        try {
            console.log("Checking backend connection");
            const response = await axios.get(`${BASE_URL}processes`);
            console.log("Backend connection OK:", response.status);
        } catch (error) {
            console.error("Backend connection error:", error);
            toast.error("Network error. Backend not reachable.", {
                toastId: 'connection-error'
            });
        }
    }

    useEffect(() => {
        getStatus();
    }, []);

    return (
        <ConnectionContext.Provider value={{
            getStatus
        }}>
            {children}
        </ConnectionContext.Provider>
    )
}