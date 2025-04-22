import type { BytesRef, StringRef, BytesDataType, StringDataType } from "../type";

import { definePipe } from "../base";
import { DEFAULT_BYTES } from "../data";
import { escapeConfusingCharacters } from "@/util";

const BASE64_DEFAULT_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

interface Base64Options {
    alphabet: string; // 64 characters + padding
}

interface Base64EncodeOptions extends Base64Options {
    multiline: boolean;
}

function base64Encode({value: input}: BytesRef, {alphabet}: Omit<Base64EncodeOptions, 'multiline'>): StringDataType {
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

    return output.map((ch) => ch < alphabet.length ? alphabet[ch] : "").join('');
}

interface Base64DecodeOptions extends Base64Options {
    multiline: boolean;
    trim_whitespace: boolean;
    allow_missing_padding: boolean;
    strict: boolean;
}

/** Note: This function assumes that `alphabet` does not contain non-BMP characters. */
function base64DecodeStrict(input: string, {alphabet, allow_missing_padding}: Pick<Base64DecodeOptions, 'alphabet' | 'allow_missing_padding'>): BytesDataType {
    if(alphabet.length < 64) {
        throw new Error("Alphabet must be at least 64 characters long.");
    }

    const base64_lookup = new Map<string, number>([...alphabet].map((ch, i) => [ch, i]));
    if(base64_lookup.size !== alphabet.length) throw new Error("Alphabet must not contain duplicate characters.");

    if(input.length === 0) {
        return DEFAULT_BYTES.value;
    }

    const pad_char = alphabet.length >= 65 ? alphabet[64] : null;
    if(pad_char == null) allow_missing_padding = true;

    if(!allow_missing_padding && (input.length % 4 !== 0)) {
        throw new Error(`Base64 encoded string length must be a multiple of 4 with padding. Got ${input.length}.`);
    }

    const num_complete_groups = Math.floor(input.length / 4);
    const leftover_len = input.length % 4;

    if(leftover_len === 1) {
        throw new Error(`Remainder of Base64 encoded string length by 4 must not be 1. The string length is ${input.length}.`);
    }

    let output_len: number;

    if(leftover_len === 0) {
        let pad_len = 0;
        if(pad_char !== null) {
            if(input.at(-1) === pad_char) {
                if(input.at(-2) === pad_char) pad_len = 2;
                else pad_len = 1;
            }
        }

        output_len = num_complete_groups * 3 - pad_len;
    } else {
        output_len = num_complete_groups * 3 + leftover_len - 1;
    }

    const output = new Uint8Array(output_len);

    let in_i = 0;
    let out_i = 0;

    for(let group=0; group < num_complete_groups; in_i+=4, ++group) {
        const ch0 = input[in_i];
        const ch1 = input[in_i+1];
        const ch2 = input[in_i+2];
        const ch3 = input[in_i+3];

        const bs = [
            base64_lookup.get(ch0),
            base64_lookup.get(ch1),
            base64_lookup.get(ch2),
            base64_lookup.get(ch3),
        ];

        let first_pad = 0;
        for(let j=0; j<4; ++j) {
            if(bs[j] == null) throw new Error(`Not a valid Base64 character '${escapeConfusingCharacters(input[in_i+j])}' at position ${in_i+j}.`);
            if(bs[j] === 64) {
                if(group !== num_complete_groups-1 || leftover_len > 0)
                    throw new Error(`Base64 padding character '${escapeConfusingCharacters(input[in_i+j])}' at position ${in_i+j} is not at the end of the input.`);
                if(j < 2)
                    throw new Error(`Misplaced Base64 padding character '${escapeConfusingCharacters(input[in_i+j])}' at position ${in_i+j}.`);
                if(first_pad === 0) first_pad = j;
                bs[j] = 0;
            } else if(first_pad) {
                throw new Error(`Character '${escapeConfusingCharacters(input[in_i+j])}' at position ${in_i+j} follows Base64 padding character.`);
            }
        }

        const [b0, b1, b2, b3] = bs as number[];

        output[out_i++] = (b0 << 2) | (b1 >> 4);
        if(first_pad === 2) {
            if(b1 & 0b1111) throw new Error(`Invalid Base64 character '${escapeConfusingCharacters(ch1)}' at position ${in_i+1}; last 4 bits of 0b${b1.toString(2).padStart(6, '0')} must be zero.`);
            break;
        }

        output[out_i++] = (b1 << 4) | (b2 >> 2);
        if(first_pad === 3) {
            if(b2 & 0b11) throw new Error(`Invalid Base64 character '${escapeConfusingCharacters(ch2)}' at position ${in_i+2}; last 2 bits of 0b${b2.toString(2).padStart(6, '0')} must be zero.`);
            break;
        }

        output[out_i++] = (b2 << 6) | b3;
    }

    if(leftover_len > 0) {
        const leftover = [...input.slice(-leftover_len)].map((ch, j) => {
            const b = base64_lookup.get(ch);
            if(b == null) throw new Error(`Not a valid Base64 character '${escapeConfusingCharacters(ch)}' at position ${in_i + j}.`);
            if(b === 64) throw new Error(`Misplaced Base64 padding character '${escapeConfusingCharacters(ch)}' at position ${in_i + j}.`);
            return b;
        });

        const [b0, b1 = 0, b2 = 0] = leftover as number[];
        
        output[out_i++] = (b0 << 2) | (b1 >> 4);
        if(leftover_len <= 2) {
            if(b1 & 0b1111) throw new Error(`Invalid Base64 character '${escapeConfusingCharacters(input[in_i+1])}' at position ${in_i+1}; last 4 bits of 0b${b1.toString(2).padStart(6, '0')} must be zero.`);
        } else {
            output[out_i++] = (b1 << 4) | (b2 >> 2);
            if(b2 & 0b11) throw new Error(`Invalid Base64 character '${escapeConfusingCharacters(input[in_i+2])}' at position ${in_i+2}; last 2 bits of 0b${b2.toString(2).padStart(6, '0')} must be zero.`);
        }
    }

    return output;
}

function base64Decode({value: input}: StringRef, {alphabet, trim_whitespace, allow_missing_padding, strict}: Omit<Base64DecodeOptions, 'multiline'>): BytesDataType {
    if(trim_whitespace) {
        input = input.trim();
    }

    if(strict) {
        return base64DecodeStrict(input, {alphabet, allow_missing_padding});
    }

    if(alphabet.length < 64) {
        throw new Error("Alphabet must be at least 64 characters long.");
    }

    const base64_lookup = new Map<string, number>([...alphabet].map((ch, i) => [ch, i]));
    if(base64_lookup.size !== alphabet.length) throw new Error("Alphabet must not contain duplicate characters.");
    
    const pad_char = alphabet.length >= 65 ? alphabet[64] : null;

    throw new Error("Not yet implemented.");
}    

export const Base64EncodePipe = definePipe<'bytes', 'string', Base64EncodeOptions>(
    {
        id: 'base64-encode',
        name: 'Bytes ⇨ Base64',
        description: "Encode bytes to base64 string.",

        inputType: 'bytes',
        outputType: 'string',
    },
    (input: BytesRef, options: Base64EncodeOptions) => Promise.resolve(base64Encode(input, options)),
    {
        alphabet: BASE64_DEFAULT_ALPHABET,
        multiline: false,
    },
    ({params, onChangeParams}) => {
        return <>
            <div className="sp-pipe-params-row">
                <label>
                    Variant: <select>
                        <option>Standard Base64 (RFC 4648)</option>
                        <option disabled>Base64URL (RFC 4648)</option>
                        <option disabled>RFC 1421, RFC 2045</option>
                        <option disabled>RFC 2152</option>
                        <option disabled>RFC 3501</option>
                    </select>
                </label>
                <label>
                    Multiline: <input checked={params.multiline} disabled type="checkbox" />
                </label>
            </div>
        </>;
    },
);

export const Base64DecodePipe = definePipe<'string', 'bytes', Base64DecodeOptions>(
    {
        id: 'base64-decode',
        name: 'Base64 ⇨ Bytes',
        description: "Decode base64 string to bytes.",

        inputType: 'string',
        outputType: 'bytes',
    },
    (input: StringRef, options: Base64DecodeOptions) => Promise.resolve(base64Decode(input, options)),
    {
        alphabet: BASE64_DEFAULT_ALPHABET,
        multiline: false,
        trim_whitespace: true,
        allow_missing_padding: true,
        strict: true,
    },
);