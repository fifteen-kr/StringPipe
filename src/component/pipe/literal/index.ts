import type { PipeCategory } from "../type";
import { BytesFromIntListPipe } from "./from-int-list";
import { ToIntListPipe } from "./to-int-list";
import { ToJSONLiteralPipe } from "./json";
import { ToPythonLiteralPipe } from "./python";
import { ToBFLiteralPipe } from "./bf";
import { ToAheuiLiteralPipe } from "./aheui";

export const PIPES_LITERAL: PipeCategory = {
    id: "literal",
    name: "Literal",
    description: "Convert to/from literals of various programming languages.",

    pipes: [
        BytesFromIntListPipe,
        ToIntListPipe,
        ToJSONLiteralPipe,
        ToPythonLiteralPipe,
        ToBFLiteralPipe,
        ToAheuiLiteralPipe,
    ],
};