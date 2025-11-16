import {createContext} from "react";

export const ProcessOperationsContext = createContext();

export function ProcessOperationsProvider({ children, processId}) {
  return (
    <ProcessOperationsContext.Provider value={{processId}}>
      {children}
    </ProcessOperationsContext.Provider>
  );
}
