import { uuidv4 } from "@/util";

import type { DataType, PipeDefinition } from "../type";
import { StringInputPipe } from "../input";

export interface PipeState {
    id: string;
    pipe_def: PipeDefinition;
    output: DataType|null;
}

export function createDefaultPipeStates(): PipeState[] {
    return [
        { id: uuidv4(), pipe_def: StringInputPipe, output: "" },
    ];
}