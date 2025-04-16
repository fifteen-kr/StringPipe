export const EncodePipe = {
    id: "encode",
    name: "Encode",

    input: "string",
    output: "bytes",

    run: (input: string) => new TextEncoder().encode(input),
};

export const DecodePipe = {
    id: "decode",
    name: "Decode",

    input: "bytes",
    output: "string",

    run: (input: Uint8Array) => new TextDecoder().decode(input),
};