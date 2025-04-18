import "./pipeline.css";

import { useCallback, useState } from "preact/hooks";

import { classNames, uuidv4 } from "@/util";
import type { AsDataTypeDefinition, DataType, PipeDefinition } from "./type";

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
    }, []);

    const [selected_catalog_pipe, setSelectedCatalogPipe] = useState<string | null>(null);

    const handleOnClickAddPipe = useCallback(() => {
        if(selected_catalog_pipe == null) return;

        const pipe_def = PIPE_BY_ID.get(selected_catalog_pipe);
        if(!pipe_def) return;
        
        setPipes((pipes) => [
            ...pipes,
            { id: uuidv4(), pipe_def, output: null },
        ]);

        setSelectedCatalogPipe(null);
    }, [selected_catalog_pipe]);

    const handleOnClickAddPipeAfter = useCallback((pipe_id: string) => {
        if(selected_catalog_pipe == null) return;

        const pipe_def = PIPE_BY_ID.get(selected_catalog_pipe);
        if(!pipe_def) return;

        setPipes((pipes) => {
            const i = pipes.findIndex(({id}) => id === pipe_id);
            if(i === -1) return pipes;

            return [
                ...pipes.slice(0, i + 1),
                { id: uuidv4(), pipe_def, output: null },
                ...pipes.slice(i + 1),
            ];
        });

        setSelectedCatalogPipe(null);
    }, [selected_catalog_pipe]);

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
                    onClickRemove={() => handleOnClickRemovePipe(id)}
                />
                <PipeGap dataType={pipe_def.outputType} onClickAddPipe={() => handleOnClickAddPipeAfter(id)} />
            </>;
        }) }
        <PipeCatalog entries={PIPES} selectedEntryId={selected_catalog_pipe} onSelect={setSelectedCatalogPipe} />
    </div>;
}

interface PipeGapProps {
    dataType?: AsDataTypeDefinition<DataType|null>;
    onClickAddPipe?: () => void;
}

function PipeGap({dataType, onClickAddPipe}: PipeGapProps) {
    return <div class={classNames("sp-pipe-gap", `sp-pipe-gap-${dataType ?? "null"}`)} onClick={onClickAddPipe}>Insert New Pipe</div>;
}