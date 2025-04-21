import { definePipe } from "../base";
import { StringDataType } from "../type";

export const TrimStringPipe = definePipe(
    {
        id: "trim-string",
        name: "Trim String",
        description: "Trim a string.",

        inputType: 'string',
        outputType: 'string',
    },
    (input: StringDataType) => Promise.resolve(input.trim()),
    {},
);