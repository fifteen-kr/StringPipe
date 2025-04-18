import type { Bytes } from "../type";
import { definePipe } from "../base";

export const UnicodeEncodePipe = definePipe<string, Bytes, {encoding: string}>(
    {
        id: "unicode-encode",
        name: "Unicode Encode",
        description: "Encode a string to bytes.",

        inputType: 'string',
        outputType: 'bytes',
    },
    async (input: string, {encoding}): Promise<Bytes> => {
        if(encoding !== 'utf-8') throw new Error(`Unsupported encoding: '${encoding}'`);
        return new TextEncoder().encode(input);
    },
    {encoding: "utf-8"},
);

export const UnicodeDecodePipe = definePipe<Bytes, string, {encoding: string}>(
    {
        id: "unicode-decode",
        name: "Unicode Decode",
        description: "Decode bytes into a string.",

        inputType: 'bytes',
        outputType: 'string',
    },
    async (input: Bytes, {encoding}): Promise<string> => {
        if(encoding !== 'utf-8') throw new Error(`Unsupported encoding: '${encoding}'`);
        return new TextDecoder().decode(input);
    },
    {encoding: "utf-8"},
);