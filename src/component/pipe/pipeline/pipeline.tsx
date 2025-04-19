import "./pipeline.css";

import { useCallback, useState } from "preact/hooks";

import { uuidv4 } from "@/util";
import type { DataType, PipeDefinition } from "../type";

import { StringInputPipe } from "../input";

import {PipeGap} from "./gap";

interface PipeState {
    id: string;
    pipe_def: PipeDefinition;
    output: DataType|null;
}

export function Pipeline() {
    const [pipes, setPipes] = useState<PipeState[]>(() => {
        return [{
            id: uuidv4(),
            pipe_def: StringInputPipe,
            output: null,
        }];
    });

    const handleOutputChange = useCallback((pipe_id: string, output: DataType) => {
        setPipes((pipes) => pipes.map((pipe) => {
            if(pipe.id === pipe_id) {
                return { ...pipe, output };
            } else {
                return pipe;
            }
        }));
    }, []);

    const handleOnClickAddPipeAfter = useCallback((pipe_id: string, pipe_def: PipeDefinition) => {
        setPipes((pipes) => {
            const i = pipes.findIndex(({id}) => id === pipe_id);
            if(i === -1) return pipes;

            return [
                ...pipes.slice(0, i + 1),
                { id: uuidv4(), pipe_def, output: null },
                ...pipes.slice(i + 1),
            ];
        });
    }, []);

    const handleOnClickRemovePipe = useCallback((pipe_id: string) => {
        setPipes((pipes) => pipes.filter(({id}) => id !== pipe_id));
    }, []);

    return <div class="sp-pipeline">
        { pipes.map(({id, pipe_def}, i) => {
            return <>
                <pipe_def.Component
                    key={id}
                    inputValue={pipe_def.inputType === 'null' ? null : pipes[i - 1].output}
                    onOutputChange={(output) => handleOutputChange(id, output)}
                    onClickRemove={i > 0 ? () => handleOnClickRemovePipe(id) : (void 0)}
                />
                <PipeGap inputType={pipe_def.inputType} outputType={pipe_def.outputType} onClickAddPipe={(catalog_def) => handleOnClickAddPipeAfter(id, catalog_def)} />
            </>;
        }) }
    </div>;
}
