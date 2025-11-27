import {createContext} from "react";

export const ProcessOperationsContext = createContext(undefined);

/**
 * @Component ProcessOperationsProvider
 * @description Provides the process operations context to its children components.
 * Provides the processId for operations related to a specific process.
 * @param props
 * @param children
 * @param processId
 * @returns {JSX.Element}
 * @constructor
 */
export function ProcessOperationsProvider({ children, processId}) {
  return (
    <ProcessOperationsContext.Provider value={{processId}}>
      {children}
    </ProcessOperationsContext.Provider>
  );
}
