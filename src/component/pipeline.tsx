import "./pipeline.css";

import { useCallback, useState } from "preact/hooks";

import { uuidv4 } from "@/util";
import type { DataType } from "@/pipe";

import { ReverseStringPipe, type PipeComponent } from "./pipe";

import { StringInputPipe } from "./pipe/string-input";

interface PipeState {
    id: string;
    Component: PipeComponent<DataType, DataType>;
    output: DataType;
}

export function Pipeline() {
    const [pipes, setPipes] = useState<PipeState[]>(() => {
        return [{
            id: uuidv4(),
            Component: StringInputPipe,
            output: "",
        }, {
            id: uuidv4(),
            Component: ReverseStringPipe as PipeComponent<DataType, DataType>,
            output: "",
        }];
    });

    const handleOutputChange = useCallback((index: number, output: DataType) => {
        setPipes((pipes) => [
            ...pipes.slice(0, index),
            {
                ...pipes[index],
                output,
            },
            ...pipes.slice(index+1),
        ])
    }, [setPipes]);

    return <div class="sp-pipeline">
        { pipes.map(({id, Component}, i) => {
            return <Component
                key={id}
                inputValue={(i === 0 ? (void 0) : pipes[i - 1].output) as DataType}
                onOutputChange={(output) => handleOutputChange(i, output)}
            />;
        }) }
    </div>;
}