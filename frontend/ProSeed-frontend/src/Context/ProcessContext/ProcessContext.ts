import { createContext, type Dispatch, type SetStateAction } from 'react';

export type ProcessContextType = {
    processId: number;
    setProcessId: Dispatch<SetStateAction<number>>;
}

const ProcessContext = createContext<ProcessContextType>({} as ProcessContextType);

export default ProcessContext;
