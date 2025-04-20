import type { Bytes } from "../type";
import { definePipe } from "../base";

export const ReversePipe = definePipe(
    {
        id: "reverse",
        name: "Reverse",
        description: "Reverse the input.",
    
        inputType: 'all',
        outputType: 'all',
    },
    (input: string|Bytes) => Promise.resolve(typeof input === 'string' ? [...input].reverse().join("") : input.toReversed()),
    {},
);
