import type { PipeCategory } from "../type";

import { PIPES_MISC } from "../misc";
import { PIPES_ENCODING } from "../encoding";

export const PIPE_CATEGORIES: Array<PipeCategory> = [
    PIPES_MISC,
    PIPES_ENCODING,
];

export const PIPES = PIPE_CATEGORIES.flatMap(category => category.entries);

export const PIPE_BY_ID = new Map(PIPES.map(pipe => [pipe.id, pipe]));