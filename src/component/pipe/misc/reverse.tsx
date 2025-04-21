import type { DataType } from "../type";
import { definePipe } from "../base";
import { isStringDataType } from "../data";

export const ReversePipe = definePipe(
    {
        id: "reverse",
        name: "Reverse",
        description: "Reverse the input.",
    
        inputType: 'all',
        outputType: 'all',
    },
    (input: DataType) => Promise.resolve(isStringDataType(input) ? [...input].reverse().join("") : input.toReversed()),
    {},
);
