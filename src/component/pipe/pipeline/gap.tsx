import "./gap.css";

import { useCallback, useState } from "preact/hooks";

import { classNames } from "@/util";

import type { RefType, DataTypeName, PipeDefinition } from "../type";
import { PIPE_BY_ID, PIPE_CATEGORIES, PipeCatalog } from "../catalog";

interface PipeGapProps {
    inputType?: DataTypeName;
    outputType?: DataTypeName;

    defaultShowCatalog?: boolean;
    alwaysShowCatalog?: boolean;
    showToggleFold?: boolean;

    onClickAddPipe?: (pipe_def: PipeDefinition) => void;
}

export function PipeGap({ inputType, outputType, defaultShowCatalog: default_show_catalog, alwaysShowCatalog: always_show_catalog, showToggleFold: show_toggle_fold = true, onClickAddPipe }: PipeGapProps) {
    const [show_catalog, setShowCatalog] = useState(default_show_catalog ?? false);

    const toggleShowCatalog = useCallback(() => {
        setShowCatalog((show_catalog) => !show_catalog);
    }, []);

    const handleOnSelect = useCallback((def_id: string) => {
        setShowCatalog(false);

        const pipe_def = PIPE_BY_ID.get(def_id);
        if(!pipe_def) return;

        onClickAddPipe?.(pipe_def);
    }, [onClickAddPipe]);

    return <div class={classNames("sp-pipe-gap", `sp-pipe-gap-${inputType ?? 'null'}`)}>
        { show_toggle_fold && <button class="sp-pipe-gap-toggle-fold" onClick={toggleShowCatalog}>{ show_catalog ? "Cancel" : "Insert Pipe" }</button> }
        { (show_catalog || always_show_catalog) && <PipeCatalog categories={PIPE_CATEGORIES} onSelect={handleOnSelect} /> }
    </div>;
}