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
    (data: StringDataType) => Promise.resolve(data.value.trim()),
    {},
);