import { definePipe } from "../base";
import { Bytes } from "../type";

export const DisplayPipe = definePipe(
    {
        id: "display",
        name: "Display",
        description: "Display input without any modification.",

        inputType: 'all',
        outputType: 'all',
    },
    (input: string|Bytes) => Promise.resolve(input),
    {},
);