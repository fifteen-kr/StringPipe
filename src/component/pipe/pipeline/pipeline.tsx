import "./pipeline.css";

import { useCallback, useState } from "preact/hooks";

import { uuidv4 } from "@/util";
import type { AsDataTypeDefinition, DataType, PipeDefinition } from "../type";

import { StringInputPipe } from "../input";

import { PipeGap } from "./gap";
import { PIPE_BY_ID } from "../catalog";

interface PipeState {
    id: string;
    pipe_def: PipeDefinition;
    output: DataType|null;
}

function getConverter(from_type: AsDataTypeDefinition<DataType|null>, to_type: AsDataTypeDefinition<DataType|null>): PipeDefinition|null {
    switch(`${from_type}-${to_type}`) {
        case "string-bytes": {
            return PIPE_BY_ID.get("unicode-encode") ?? null;
        }
        case "bytes-string": {
            return PIPE_BY_ID.get("unicode-decode") ?? null;
        }
        default: return null;
    }
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

            const insert_pipes = [
                { id: uuidv4(), pipe_def, output: null },
            ];

            if(pipes[i].pipe_def.outputType !== pipe_def.inputType) {
                const converter = getConverter(pipes[i].pipe_def.outputType, pipe_def.inputType);
                if(converter) insert_pipes.unshift({ id: uuidv4(), pipe_def: converter, output: null });
            }

            if(i+1 < pipes.length && pipes[i+1].pipe_def.inputType !== pipe_def.outputType) {
                const converter = getConverter(pipe_def.outputType, pipes[i+1].pipe_def.inputType);
                if(converter) insert_pipes.push({ id: uuidv4(), pipe_def: converter, output: null });
            }

            return [
                ...pipes.slice(0, i + 1),
                ...insert_pipes,
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
                <PipeGap
                    inputType={pipe_def.inputType}
                    outputType={pipe_def.outputType}
                    defaultShowCatalog={i+1 === pipes.length}
                    onClickAddPipe={(catalog_def) => handleOnClickAddPipeAfter(id, catalog_def)}
                />
            </>;
        }) }
    </div>;
}
