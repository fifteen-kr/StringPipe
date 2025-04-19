import "./gap.css";

import { useCallback, useState } from "preact/hooks";

import { classNames } from "@/util";

import type { DataType, AsDataTypeDefinition, PipeDefinition } from "../type";
import { PIPE_BY_ID, PipeCatalog, PIPES } from "../catalog";

interface PipeGapProps {
    inputType?: AsDataTypeDefinition<DataType|null>;
    outputType?: AsDataTypeDefinition<DataType|null>;

    onClickAddPipe?: (pipe_def: PipeDefinition) => void;
}

export function PipeGap({ inputType, outputType, onClickAddPipe }: PipeGapProps) {
    const [show_catalog, setShowCatalog] = useState(true);

    const toggleShowCatalog = useCallback(() => {
        setShowCatalog((show_catalog) => !show_catalog);
    }, []);

    const handleOnSelect = useCallback((def_id: string) => {
        setShowCatalog(false);

        const pipe_def = PIPE_BY_ID.get(def_id);
        if(!pipe_def) return;

        onClickAddPipe?.(pipe_def);
    }, [onClickAddPipe]);

    return <div class={classNames("sp-pipe-gap", `sp-pipe-gap-${outputType ?? 'null'}`)}>
        <button onClick={toggleShowCatalog}>{ show_catalog ? "Close" : "Add" }</button>
        { show_catalog && <PipeCatalog entries={PIPES} onSelect={handleOnSelect} /> }
    </div>;
}