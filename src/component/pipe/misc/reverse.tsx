import type { RefType } from "../type";
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
    (data: RefType) => Promise.resolve(isStringDataType(data) ? [...data.value].reverse().join("") : data.value.toReversed()),
    {},
);
