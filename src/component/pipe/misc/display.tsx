import { definePipe } from "../base";
import { RefType } from "../type";

export const DisplayPipe = definePipe(
    {
        id: "display",
        name: "Display",
        description: "Display input without any modification.",

        inputType: 'all',
        outputType: 'all',
    },
    (input: RefType) => Promise.resolve(input),
    {},
);