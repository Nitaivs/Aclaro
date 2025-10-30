import {useState, type ReactNode} from 'react'
import ProcessContext, {type ProcessContextType} from "./ProcessContext.ts";

type Props = { children: ReactNode }

export default function ProcessContextProvider({ children }: Props) {
    const [processId, setProcessId] = useState<number>(0);

    const context: ProcessContextType= { setProcessId, processId  }

    return (
        <ProcessContext value={context}>
            {children}
        </ProcessContext>
    )
}
