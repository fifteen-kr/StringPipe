import type { BytesDataType, StringDataType } from "@/component/pipe";
import type { BaseEncodingParams, BaseDecodingParams, EncodingDefinition } from "../type";

export interface UTF16EncodingParams extends BaseEncodingParams {
    endian: 'big' | 'little';
}

export interface UTF16DecodingParams extends BaseDecodingParams {
    endian: 'big' | 'little';
}

export const UTF_16_ENCODING: EncodingDefinition<UTF16EncodingParams, UTF16DecodingParams> = {
    id: "utf-16",
    name: "UTF-16",

    async encode(str: StringDataType, {endian}): Promise<BytesDataType> {
        const buffer: number[] = [];

        // Exploit the fact that JavaScript strings are UTF-16 encoded.
        for(let i=0; i<str.length; ++i) {
            const ch = str.charCodeAt(i);

            if(ch < 0 || ch > 0xFFFF) { throw new Error(`Invalid codepoint: ${ch}`); }

            if(ch <= 0xFF) {
                if(endian === 'big') {
                    buffer.push(0, ch);
                } else {
                    buffer.push(ch, 0);
                }
            } else {
                if(endian === 'big') {
                    buffer.push(ch >> 8, ch & 0xFF);
                } else {
                    buffer.push(ch & 0xFF, ch >> 8);
                }
            }
        }

        return new Uint8Array(buffer);
    },

    async decode(bytes: BytesDataType, {endian}): Promise<StringDataType> {
        return new TextDecoder(`utf-16${endian === 'big' ? 'be' : 'le'}`).decode(bytes);
    },
};