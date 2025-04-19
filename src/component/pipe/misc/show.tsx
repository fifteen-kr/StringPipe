import { definePipe } from "../base";
import { Bytes } from "../type";

export const ShowStringPipe = definePipe(
    {
        id: "id-string",
        name: "Show String",
        description: "Show a string without any modification.",

        inputType: 'string',
        outputType: 'string',
    },
    (input: string) => Promise.resolve(input),
    {},
);

export const ShowBytesPipe = definePipe(
    {
        id: "id-bytes",
        name: "Show Bytes",
        description: "Show bytes without any modification.",

        inputType: 'bytes',
        outputType: 'bytes',
    },
    (input: Bytes) => Promise.resolve(input),
    {},
);