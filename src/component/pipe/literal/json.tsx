import { definePipe } from "../base";
import { DataType, StringDataType } from "../type";

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
    async (input: DataType): Promise<StringDataType> => {
        if(typeof input === 'string') {
            return JSON.stringify(input);
        } else {
            return JSON.stringify(Array.from(input));
        }
    },
    {},
);