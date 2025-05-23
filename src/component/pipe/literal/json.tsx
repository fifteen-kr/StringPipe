import { definePipe } from "../base";
import { isStringDataType } from "../data";
import { RefType, StringRef, StringDataType } from "../type";

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
    async (input: RefType): Promise<StringDataType> => {
        if(isStringDataType(input)) {
            return JSON.stringify(input.value);
        } else {
            return JSON.stringify(Array.from(input.value));
        }
    },
    {},
);