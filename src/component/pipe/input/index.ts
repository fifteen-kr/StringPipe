import { definePipe } from "../base";

export const StringInputPipe = definePipe(
    {
        id: "input-string",
        name: "String Input",
        description: "Provide String Input.",
    
        inputType: 'null',
        outputType: 'string',
    },
    () => Promise.reject(new Error("Invalid input!")),
    {},
);