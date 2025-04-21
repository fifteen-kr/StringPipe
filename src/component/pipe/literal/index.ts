import type { PipeCategory } from "../type";
import { BytesFromIntListPipe } from "./from-int-list";
import { ToIntListPipe } from "./to-int-list";
import { ToPythonLiteralPipe } from "./python";

export * from "./python";

export const PIPES_LITERAL: PipeCategory = {
    id: "literal",
    name: "Literal",
    description: "Convert to/from literals of various programming languages.",

    pipes: [
        BytesFromIntListPipe,
        ToIntListPipe,
        ToPythonLiteralPipe,
    ],
};