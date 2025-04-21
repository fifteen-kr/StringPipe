import "./pipeline.css";

import { useCallback, useState } from "preact/hooks";

import { uuidv4 } from "@/util";
import type { RefType, DataTypeName, PipeDefinition } from "../type";

import { PipeGap } from "./gap";
import { PIPE_BY_ID } from "../catalog";
import { getDataTypeName } from "../data";

import { createDefaultPipeStates, type PipeState } from "./state";

function getCastPipe(from_type: DataTypeName, to_type: DataTypeName): PipeDefinition|null {
    if(to_type === 'all') return null;

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
    const [pipes, setPipes] = useState<PipeState[]>(() => createDefaultPipeStates());

    const handleOutputChange = useCallback((pipe_id: string, output: RefType) => {
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

            const prev_out_type = getDataTypeName(pipes[i].output, pipes[i].pipe_def.outputType);
            if(prev_out_type !== pipe_def.inputType) {
                const converter = getCastPipe(prev_out_type, pipe_def.inputType);
                if(converter) insert_pipes.unshift({ id: uuidv4(), pipe_def: converter, output: null });
            }

            const next_in_type = i+1 < pipes.length ? getDataTypeName(pipes[i].output, pipes[i+1].pipe_def.inputType) : null;
            if(next_in_type != null && next_in_type !== pipe_def.outputType) {
                const converter = getCastPipe(pipe_def.outputType, next_in_type);
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
        { pipes.map(({id, pipe_def, output}, i) => {
            return <>
                <pipe_def.Component
                    key={id}
                    inputValue={pipe_def.inputType === 'null' ? null : pipes[i - 1].output}
                    onOutputChange={(output) => handleOutputChange(id, output)}
                    onClickRemove={i > 0 ? () => handleOnClickRemovePipe(id) : (void 0)}
                />
                <PipeGap
                    inputType={getDataTypeName(output)}
                    outputType={getDataTypeName(output)}
                    defaultShowCatalog={i+1 === pipes.length}
                    alwaysShowCatalog={pipes.length <= 1}
                    showToggleFold={pipes.length > 1}
                    onClickAddPipe={(catalog_def) => handleOnClickAddPipeAfter(id, catalog_def)}
                />
            </>;
        }) }
    </div>;
}
