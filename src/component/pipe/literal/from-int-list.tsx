import { useCallback } from "preact/hooks";
import { definePipe } from "../base";
import { StringRef, BytesDataType } from "../type";
import { INT_RADIX_DATA_BY_ID, IntRadixType, SelectIntRadix } from "./int-radix";

interface FromIntListParams {
    int_radix: IntRadixType
}

function parseIntList(input: string, int_radix: IntRadixType): number[] {
    const output: number[] = [];

    const {base} = INT_RADIX_DATA_BY_ID.get(int_radix)!;

    let allowed_set: string;

    switch(base) {
        case 2: allowed_set = "0-1"; break;
        case 8: allowed_set = "0-7"; break;
        case 10: allowed_set = "0-9"; break;
        case 16: allowed_set = "0-9A-F"; break;
        default: throw new Error(`Unsupported base: ${base}`);
    }
    
    const allowed_regex = new RegExp(`^[${allowed_set}]+$`, 'i');

    for(const [_, match] of input.matchAll(/([0-9A-Z]+)/ig)) {
        if(!allowed_regex.test(match)) throw new Error(`Invalid word in int list: '${match}'`);

        let x: bigint;
        try {
            switch(base) {
                case 2: x = BigInt(`0b${match}`); break;
                case 8: x = BigInt(`0o${match}`); break;
                case 10: x = BigInt(match); break;
                case 16: x = BigInt(`0x${match}`); break;
            }
        } catch(e) {
            throw new Error(`Error parsing '${match}' in base ${base}`);
        }

        let num_bytes: number;
        if(x === 0n) {
            num_bytes = 1;
        } else {
            num_bytes = Math.ceil(x.toString(16).length/2);
        }

        for (let i = num_bytes - 1; i >= 0; --i) {
            output.push(Number((x >> BigInt(i * 8)) & 0xFFn));
        }
    }

    return output;
}

export const BytesFromIntListPipe = definePipe<'string', 'bytes', FromIntListParams>(
    {
        id: "bytes-from-int-list",
        name: "Int List ⇨ Bytes",
        description: "Convert a list of integers to bytes.",

        inputType: 'string',
        outputType: 'bytes',
    },
    async ({value}: StringRef, params): Promise<BytesDataType> => {
        return new Uint8Array(parseIntList(value, params.int_radix));
    },
    {
        int_radix: 'hex',
    },
    ({params, onChangeParams}) => {
        const handleOnChangeIntLiteralType = useCallback((int_radix: IntRadixType) => {
            onChangeParams({int_radix});
        }, [onChangeParams]);
        return <>
            <div className="sp-pipe-params-row">
                <SelectIntRadix value={params.int_radix} onChange={handleOnChangeIntLiteralType}/>
            </div>
        </>;
    },
);