import type { BytesDataType, StringDataType, UnderlyingBytesDataType, UnderlyingStringDataType } from "../type";
import { definePipe } from "../base";

export const UnicodeEncodePipe = definePipe(
    {
        id: "unicode-encode",
        name: "Unicode Encode",
        description: "Encode a string to bytes.",

        inputType: 'string',
        outputType: 'bytes',
    },
    async ({value}: StringDataType, {encoding}): Promise<UnderlyingBytesDataType> => {
        if(encoding !== 'utf-8') throw new Error(`Unsupported encoding: '${encoding}'`);
        return new TextEncoder().encode(value);
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
    async ({value}: BytesDataType, {encoding}): Promise<UnderlyingStringDataType> => {
        if(encoding !== 'utf-8') throw new Error(`Unsupported encoding: '${encoding}'`);
        return new TextDecoder().decode(value);
    },
    {encoding: "utf-8"},
);