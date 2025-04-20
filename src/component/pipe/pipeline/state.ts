import { uuidv4 } from "@/util";

import type { DataType, PipeDefinition } from "../type";
import { StringInputPipe } from "../input";
import { ToIntListPipe } from "../literal/int-list";

export interface PipeState {
    id: string;
    pipe_def: PipeDefinition;
    output: DataType|null;
}

export function createDefaultPipeStates(): PipeState[] {
    return [
        { id: uuidv4(), pipe_def: StringInputPipe, output: "" },
        { id: uuidv4(), pipe_def: ToIntListPipe, output: "" },
    ];
}