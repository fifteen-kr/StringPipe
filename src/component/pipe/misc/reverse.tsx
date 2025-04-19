import { definePipe } from "../base";

export const ReverseStringPipe = definePipe(
    {
        id: "reverse-string",
        name: "Reverse String",
        description: "Reverse a string.",
    
        inputType: 'string',
        outputType: 'string',
    },
    (input: string) => Promise.resolve([...input].reverse().join("")),
    {},
);
