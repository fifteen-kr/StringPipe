import { uuidv4 } from "@/util";

import type { RefType, PipeDefinition } from "../type";
import { StringInputPipe } from "../input";
import { DEFAULT_STRING } from "../data";

export interface PipeState {
    id: string;
    pipe_def: PipeDefinition;
    output: RefType|null;
}

export function createDefaultPipeStates(): PipeState[] {
    return [
        { id: uuidv4(), pipe_def: StringInputPipe, output: DEFAULT_STRING },
    ];
}