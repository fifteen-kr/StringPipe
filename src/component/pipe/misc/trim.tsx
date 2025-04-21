import { definePipe } from "../base";
import { StringRef } from "../type";

export const TrimStringPipe = definePipe(
    {
        id: "trim-string",
        name: "Trim String",
        description: "Trim a string.",

        inputType: 'string',
        outputType: 'string',
    },
    (data: StringRef) => Promise.resolve(data.value.trim()),
    {},
);