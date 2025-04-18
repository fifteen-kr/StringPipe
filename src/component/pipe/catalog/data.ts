import { PIPES_COMMON } from "../common";

export const PIPES = [
    ...PIPES_COMMON,
];

export const PIPE_BY_ID = new Map(PIPES.map(pipe => [pipe.id, pipe]));