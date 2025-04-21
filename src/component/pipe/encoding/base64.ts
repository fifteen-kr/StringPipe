import type { BytesDataType, StringDataType, UnderlyingBytesDataType, UnderlyingStringDataType } from "../type";

import { definePipe } from "../base";

function base64Encode({value: input}: BytesDataType): UnderlyingStringDataType {
    // TODO: implement custom char #62 to #64
    const base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    const output: number[] = [];

    let i = 0;
    for(; i + 3 <= input.length; i+=3) {
        const data_0 = input[i];
        const data_1 = input[i+1];
        const data_2 = input[i+2];

        output.push(
            (data_0 & 0b11111100) >> 2,
            ((data_0 & 0b00000011) << 4) | ((data_1 & 0b11110000) >> 4),
            ((data_1 & 0b00001111) << 2) | ((data_2 & 0b11000000) >> 6),
            (data_2 & 0b00111111),
        );
    }

    if(i < input.length) {
        const data_0 = input[i];
        const data_1 = i+1 < input.length ? input[i+1] : 0;

        output.push(
            (data_0 & 0b11111100) >> 2,
            ((data_0 & 0b00000011) << 4) | ((data_1 & 0b11110000) >> 4),
            i+1 < input.length ? ((data_1 & 0b00001111) << 2) : 64,
            64,
        );
    }

    return output.map((ch) => base64_chars[ch]).join('');
}

function base64Decode({value: input}: StringDataType): UnderlyingBytesDataType {
    // TODO: implement custom char #62 to #64
    const base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    const base64_lookup = new Map<string, number>(base64_chars.split('').map((ch, i) => [ch, i]));

    if(input.length % 4 === 1) {
        throw new Error("Invalid base64 string length");
    }

    const pad_length = input.at(-1) === base64_chars[64] ? input.at(-2) === base64_chars[64] ? 2 : 1 : 0;
    const output_len = Math.floor(3 * (input.length - pad_length) / 4);
    const output = new Uint8Array(output_len);

    let output_ind = 0;
    let i = 0;

    for(; i + 4 <= input.length; i+=4, output_ind+=3) {
        let data_0 = base64_lookup.get(input[i]);
        if(data_0 == null) throw new Error(`Invalid base64 char: '${input[i]}'`);
        if(data_0 === 64) data_0 = 0;

        let data_1 = base64_lookup.get(input[i+1]);
        if(data_1 == null) throw new Error(`Invalid base64 char: '${input[i+1]}'`);
        if(data_1 === 64) data_1 = 0;

        let data_2 = base64_lookup.get(input[i+2]);
        if(data_2 == null) throw new Error(`Invalid base64 char: '${input[i+2]}'`);
        if(data_2 === 64) data_2 = 0;

        let data_3 = base64_lookup.get(input[i+3]);
        if(data_3 == null) throw new Error(`Invalid base64 char: '${input[i+3]}'`);
        if(data_3 === 64) data_3 = 0;

        output[output_ind] = (data_0 << 2) | (data_1 >> 4);
        output[output_ind+1] = (data_1 << 4) | (data_2 >> 2);
        output[output_ind+2] = (data_2 << 6) | data_3;
    }

    if(i < input.length) {
        // Assume that the padding is missing.
        let data_0 = base64_lookup.get(input[i]);
        if(data_0 == null) throw new Error(`Invalid base64 char: '${input[i]}'`);
        if(data_0 === 64) data_0 = 0;

        let data_1 = i+1 < input.length ? base64_lookup.get(input[i+1]) : 0;
        if(data_1 == null) throw new Error(`Invalid base64 char: '${input[i+1]}'`);
        if(data_1 === 64) data_1 = 0;

        let data_2 = i+2 < input.length ? base64_lookup.get(input[i+2]) : 0;
        if(data_2 == null) throw new Error(`Invalid base64 char: '${input[i+2]}'`);
        if(data_2 === 64) data_2 = 0;

        output[output_ind] = (data_0 << 2) | (data_1 >> 4);
        if(output_ind+1 < output.length) output[output_ind+1] = (data_1 << 4) | (data_2 >> 2);
        if(output_ind+2 < output.length) output[output_ind+2] = (data_2 << 6);
    }

    return output;
}

export const Base64EncodePipe = definePipe(
    {
        id: 'base64-encode',
        name: 'Bytes ⇨ Base64',
        description: "Encode bytes to base64 string.",

        inputType: 'bytes',
        outputType: 'string',
    },
    async (input: BytesDataType): Promise<UnderlyingStringDataType> => {
        return base64Encode(input);
    },
    {},
);

export const Base64DecodePipe = definePipe(
    {
        id: 'base64-decode',
        name: 'Base64 ⇨ Bytes',
        description: "Decode base64 string to bytes.",

        inputType: 'string',
        outputType: 'bytes',
    },
    async (input: StringDataType): Promise<UnderlyingBytesDataType> => {
        return base64Decode(input);
    },
    {},
);