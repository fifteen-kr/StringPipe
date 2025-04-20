import { definePipe } from "../base";
import { Bytes } from "../type";

export const ToPythonLiteralPipe = definePipe(
    {
        id: "to-python-literal",
        name: "To Python Literal",
        description: "Convert the value to a Python literal.",

        inputType: 'all',
        outputType: 'string',
    },
    async (input: string|Bytes): Promise<string> => {
        if(typeof input === 'string') {
            return JSON.stringify(input);
        } else {
            // Return a Python bytes string, leaving displayable characters as-is.
            return `b"${Array.from(input).map(b => b >= 32 && b <= 126 && b != 34 && b != 92 ? String.fromCharCode(b) : `\\x${b.toString(16).padStart(2, '0')}`).join('')}"`
        }
    },
    {},
);