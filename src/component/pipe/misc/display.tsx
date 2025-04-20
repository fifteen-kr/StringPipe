import { definePipe } from "../base";
import { Bytes } from "../type";

export const DisplayPipe = definePipe(
    {
        id: "display",
        name: "Display Data",
        description: "Display data without any modification.",

        inputType: 'all',
        outputType: 'all',
    },
    (input: string|Bytes) => Promise.resolve(input),
    {},
);