import { BasePipe, definePipe } from "../base";
import { PipeDefinition } from "../type";

export const StringInputPipe = definePipe<null, string, {}>(
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
