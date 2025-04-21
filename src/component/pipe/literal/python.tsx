import { definePipe } from "../base";
import { isStringDataType } from "../data";
import { DataType, StringDataType, UnderlyingStringDataType } from "../type";

export const ToPythonLiteralPipe = definePipe(
    {
        id: "to-python-literal",
        name: "Data ⇨ Python",
        description: "Convert the value to a Python literal.",

        inputType: 'all',
        outputType: 'string',
    },
    async (input: DataType): Promise<UnderlyingStringDataType> => {
        if(isStringDataType(input)) {
            return JSON.stringify(input.value);
        } else {
            // Return a Python bytes string, leaving displayable characters as-is.
            return `b"${Array.from(input.value).map(b => b >= 32 && b <= 126 && b != 34 && b != 92 ? String.fromCharCode(b) : `\\x${b.toString(16).padStart(2, '0')}`).join('')}"`
        }
    },
    {},
);