import "./pipeline.css";

import { useCallback, useState } from "preact/hooks";

import { uuidv4 } from "@/util";
import type { DataType, PipeDefinition } from "./type";

import { PIPE_BY_ID, PipeCatalog, PIPES } from "./catalog";
import { StringInputPipe } from "./common";

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
    }, [setPipes]);

    const [selected_catalog_pipe, setSelectedCatalogPipe] = useState<string | null>(null);

    const handleOnClickAddPipe = useCallback(() => {
        if(selected_catalog_pipe == null) return;

        const pipe_def = PIPE_BY_ID.get(selected_catalog_pipe);
        if(pipe_def) {
            setPipes((pipes) => [
                ...pipes,
                {
                    id: uuidv4(),
                    pipe_def,
                    output: null
                },
            ]);
        }

        setSelectedCatalogPipe(null);
    }, [setSelectedCatalogPipe, selected_catalog_pipe]);

    const handleOnClickRemovePipe = useCallback((pipe_id: string) => {
        setPipes((pipes) => pipes.filter(({id}) => id !== pipe_id));
    }, [setPipes]);

    return <div class="sp-pipeline">
        { pipes.map(({id, pipe_def}, i) => {
            if(pipe_def == null) debugger;
            return <pipe_def.Component
                key={id}
                inputValue={pipe_def.inputType === 'null' ? null : pipes[i - 1].output}
                onOutputChange={(output) => handleOutputChange(id, output)}
                onClickRemove={() => handleOnClickRemovePipe(id)}
            />;
        }) }
        <PipeCatalog entries={PIPES} selectedEntryId={selected_catalog_pipe} onSelect={setSelectedCatalogPipe} />
        <button onClick={handleOnClickAddPipe}>Add Pipe</button>
    </div>;
}