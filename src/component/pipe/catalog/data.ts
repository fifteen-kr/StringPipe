import type { PipeCategory } from "../type";

import { PIPES_MISC } from "../misc";
import { PIPES_ENCODING } from "../encoding";
import { PIPES_LITERAL } from "../literal";
import { PIPES_CIPHER } from "../cipher";

export const PIPE_CATEGORIES: Array<PipeCategory> = [
    PIPES_MISC,
    PIPES_ENCODING,
    PIPES_LITERAL,
    PIPES_CIPHER,
];

export const PIPES = PIPE_CATEGORIES.flatMap(category => category.pipes);

export const PIPE_BY_ID = new Map(PIPES.map(pipe => [pipe.id, pipe]));