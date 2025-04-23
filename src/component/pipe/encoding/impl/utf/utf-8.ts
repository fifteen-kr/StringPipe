import type { BytesDataType, StringDataType } from "@/component/pipe";
import type { BaseEncodingParams, BaseDecodingParams, EncodingDefinition } from "../type";

export interface UTF8EncodingParams extends BaseEncodingParams {
    transform_nul: boolean; // Whether to transform the NUL character to 0xC0 0x80 (as in Java's modified UTF-8).
    use_surrogate_pairs: boolean; // Whether to use surrogate pairs for characters outside the BMP (as in Java's modified UTF-8).
}

export interface UTF8DecodingParams extends BaseDecodingParams {
    allow_incorrect_length: boolean; // Whether to allow decoding of incorrect-length sequences.
    combine_surrogate_pairs: boolean; // Whether to combine surrogate pairs into a single character (as in Java's modified UTF-8).
}

function utf_8_encode_ch(ch: number): number[] {
    if(ch <= 0x7F) return [ch];
    if(ch <= 0x7FF) return [0xC0 | (ch >> 6), 0x80 | (ch & 0x3F)];
    if(ch <= 0xFFFF) return [0xE0 | (ch >> 12), 0x80 | ((ch >> 6) & 0x3F), 0x80 | (ch & 0x3F)];
    if(ch <= 0x10FFFF) return [0xF0 | (ch >> 18), 0x80 | ((ch >> 12) & 0x3F), 0x80 | ((ch >> 6) & 0x3F), 0x80 | (ch & 0x3F)];

    throw new Error(`Can't UTF-8 encode character with codepoint: ${ch}`);
}

export const UTF_8_ENCODING: EncodingDefinition<UTF8EncodingParams> = {
    id: "utf-8",
    name: "UTF-8",

    async encode(str: StringDataType, params: UTF8EncodingParams): Promise<BytesDataType> {
        if(!(params.transform_nul || params.use_surrogate_pairs)) {
            // Use the built-in TextEncoder for the standard UTF-8 encoding.
            return new TextEncoder().encode(str);
        }

        const buffer: number[] = [];

        if(params.use_surrogate_pairs) {
            // Exploit the fact that JavaScript strings are UTF-16 encoded.
            for(let i=0; i<str.length; ++i) {
                const ch = str.charCodeAt(i);
                if(ch === 0) {
                    if(params.transform_nul) {
                        buffer.push(0xC0, 0x80);
                    } else {
                        buffer.push(0x00);
                    }
                } else {
                    buffer.push(...utf_8_encode_ch(ch));
                }
            }
        } else {
            for(const c of str) {
                const ch = c.codePointAt(0)!;
                if(ch === 0) {
                    if(params.transform_nul) {
                        buffer.push(0xC0, 0x80);
                    } else {
                        buffer.push(0x00);
                    }
                } else {
                    buffer.push(...utf_8_encode_ch(ch));
                }
            }
        }

        return new Uint8Array(buffer);
    },

    async decode(bytes: BytesDataType): Promise<StringDataType> {
        // TODO: Handle params.

        return new TextDecoder().decode(bytes);
    },
};