import { definePipe } from "../base";
import { BytesDataType, StringDataType } from "../type";

function parseIntList(input: string): number[] {
    const output: number[] = [];

    for(const [_, match] of input.matchAll(/([0-9A-Z]+)/ig)) {
        if(/[G-Z]/i.test(match)) throw new Error(`Invalid character in int list: '${match}'`);

        if(match.length <= 8) {
            let x = parseInt(match, 16);
            const num_bytes = (match.length + 1) >> 1;
    
            for(let i=num_bytes-1; i>=0; --i) {
                output.push((x >> (i*8)) & 0xFF);
            }
        } else {
            let x = BigInt(`0x${match}`);
            const num_bytes = (match.length + 1) >> 1;

            for(let i=num_bytes-1; i>=0; --i) {
                output.push(Number((x >> BigInt(i*8)) & 0xFFn));
            }
        }
    }

    return output;
}

export const BytesFromIntListPipe = definePipe<'string', 'bytes', {}>(
    {
        id: "bytes-from-int-list",
        name: "Int List ⇨ Bytes",
        description: "Convert a list of integers to bytes.",

        inputType: 'string',
        outputType: 'bytes',
    },
    async (input: StringDataType, params): Promise<BytesDataType> => {
        return new Uint8Array(parseIntList(input));
    },
    {},
);