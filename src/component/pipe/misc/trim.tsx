import { definePipe } from "../base";

export const TrimStringPipe = definePipe<string, string, {}>(
    {
        id: "trim-string",
        name: "Trim String",
        description: "Trim a string.",

        inputType: 'string',
        outputType: 'string',
    },
    (input: string) => Promise.resolve(input.trim()),
    {},
);