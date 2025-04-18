import "./pipeline.css";

import { useCallback, useState } from "preact/hooks";

import { uuidv4 } from "@/util";
import type { DataType, PipeComponentType } from "./type";

import { StringInputPipe } from "./string-input";
import { PIPE_BY_ID, PipeCatalog, PIPES } from "./catalog";

interface PipeState {
    id: string;
    Component: PipeComponentType;
    output: DataType|null;
}

export function Pipeline() {
    const [pipes, setPipes] = useState<PipeState[]>(() => {
        return [{
            id: uuidv4(),
            Component: StringInputPipe,
            output: null,
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

    const [selected_catalog_pipe, setSelectedCatalogPipe] = useState<string | null>(null);

    const handleOnClickAddPipe = useCallback(() => {
        if(selected_catalog_pipe == null) return;

        const pipe_def = PIPE_BY_ID.get(selected_catalog_pipe);
        if(pipe_def) {
            setPipes((pipes) => [
                ...pipes,
                {
                    id: uuidv4(),
                    Component: pipe_def.Component,
                    output: null
                },
            ]);
        }

        setSelectedCatalogPipe(null);
    }, [setSelectedCatalogPipe, selected_catalog_pipe]);

    return <div class="sp-pipeline">
        { pipes.map(({id, Component}, i) => {
            return <Component
                key={id}
                inputValue={i === 0 ? null : pipes[i - 1].output}
                onOutputChange={(output) => handleOutputChange(i, output)}
            />;
        }) }
        <PipeCatalog entries={PIPES} selectedEntryId={selected_catalog_pipe} onSelect={setSelectedCatalogPipe} />
        <button onClick={handleOnClickAddPipe}>Add Pipe</button>
    </div>;
}