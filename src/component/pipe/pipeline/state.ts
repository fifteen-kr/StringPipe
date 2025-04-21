import { uuidv4 } from "@/util";

import type { DataType, PipeDefinition } from "../type";
import { StringInputPipe } from "../input";
import { DEFAULT_STRING } from "../data";

export interface PipeState {
    id: string;
    pipe_def: PipeDefinition;
    output: DataType|null;
}

export function createDefaultPipeStates(): PipeState[] {
    return [
        { id: uuidv4(), pipe_def: StringInputPipe, output: DEFAULT_STRING },
    ];
}