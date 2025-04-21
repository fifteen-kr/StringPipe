import type { BytesDataType, StringDataType } from "../type";
import { definePipe } from "../base";

export const UnicodeEncodePipe = definePipe(
    {
        id: "unicode-encode",
        name: "Unicode Encode",
        description: "Encode a string to bytes.",

        inputType: 'string',
        outputType: 'bytes',
    },
    async (input: StringDataType, {encoding}): Promise<BytesDataType> => {
        if(encoding !== 'utf-8') throw new Error(`Unsupported encoding: '${encoding}'`);
        return new TextEncoder().encode(input);
    },
    {encoding: "utf-8"},
);

export const UnicodeDecodePipe = definePipe(
    {
        id: "unicode-decode",
        name: "Unicode Decode",
        description: "Decode bytes into a string.",

        inputType: 'bytes',
        outputType: 'string',
    },
    async (input: BytesDataType, {encoding}): Promise<StringDataType> => {
        if(encoding !== 'utf-8') throw new Error(`Unsupported encoding: '${encoding}'`);
        return new TextDecoder().decode(input);
    },
    {encoding: "utf-8"},
);