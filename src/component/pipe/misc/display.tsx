import { definePipe } from "../base";
import { DataType } from "../type";

export const DisplayPipe = definePipe(
    {
        id: "display",
        name: "Display",
        description: "Display input without any modification.",

        inputType: 'all',
        outputType: 'all',
    },
    (input: DataType) => Promise.resolve(input),
    {},
);