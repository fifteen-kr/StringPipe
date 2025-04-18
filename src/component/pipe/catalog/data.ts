import { PIPES_COMMON } from "../common";
import { PIPES_ENCODING } from "../encoding";

export const PIPES = [
    ...PIPES_COMMON,
    ...PIPES_ENCODING,
];

export const PIPE_BY_ID = new Map(PIPES.map(pipe => [pipe.id, pipe]));