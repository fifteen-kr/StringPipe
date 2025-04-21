import { definePipe } from "../base";
import { Bytes } from "../type";

interface ToJSONLiteralParams {
}

export const ToJSONLiteralPipe = definePipe(
    {
        id: "to-json-literal",
        name: "Data ⇨ JSON",
        description: "Convert the value to a JSON string literal.",

        inputType: 'all',
        outputType: 'string',
    },
    async (input: string|Bytes): Promise<string> => {
        if(typeof input === 'string') {
            return JSON.stringify(input);
        } else {
            return JSON.stringify(Array.from(input));
        }
    },
    {},
);