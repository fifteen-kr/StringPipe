import { definePipe } from "../base";
import { BytesDataType, BytesRef, StringDataType } from "../type";

export interface GenerateBFPrintParams {
    print: true;
    buffer_size: number; // For printing, \# of cells to use as buffer.
    wraparound: boolean; // Allow the buffer to wrap around.
    clear: boolean; // Do not assume that the memory is clean.
}

export interface GenerateBFStoreParams {
    print: false;
    wraparound: boolean;
    clear: boolean;
}

export type ToBFLiteralParams = GenerateBFPrintParams | GenerateBFStoreParams;

function* generateBFPrintCodeSingleCell(bytes: BytesDataType, cell_size: number, wraparound: boolean, ): Generator<string> {
    let prev_value = 0;
    for(const byte of bytes) {
        if(byte !== prev_value) {
            const candidates: Array<[tag: string, repeat: number, code_len: number]> = [];
            
            if(prev_value < byte) candidates.push(['+', byte - prev_value, byte - prev_value]);
            else candidates.push(['-', prev_value - byte, prev_value - byte]);

            candidates.push(['0+', byte, 3 + byte]);

            if(wraparound) {
                if(prev_value < byte) candidates.push(['-', cell_size - byte + prev_value, cell_size - byte + prev_value]);
                else candidates.push(['+', cell_size - prev_value + byte, cell_size - prev_value + byte]);

                candidates.push(['0-', cell_size - byte, 3 + cell_size - byte]);
            }

            const [min_strat, repeat] = candidates.reduce((a, b) => a[2] < b[2] ? a : b);

            switch(min_strat) {
                case '+': yield "+".repeat(repeat); break;
                case '-': yield "-".repeat(repeat); break;
                case "0+": yield "[-]" + "+".repeat(repeat); break;
                case "0-": yield "[-]" + "-".repeat(repeat); break;
                default: throw new Error(`Invalid strategy: ${min_strat}`);
            }
        }

        yield ".";
        prev_value = byte;
    }
}

function generateBFPrintCode(bytes: BytesDataType, {buffer_size, wraparound, clear}: GenerateBFPrintParams): string {
    if(bytes.length === 0) {
        return "";
    }

    if(buffer_size < 1) {
        throw new Error("Buffer size must be at least 1.");
    }

    const code_segments: string[] = [];

    if(buffer_size === 1) {
        if(clear) code_segments.push("[-]");

        code_segments.push(...generateBFPrintCodeSingleCell(bytes, 256, wraparound));

        return code_segments.join("");
    }
    
    let curr_ind = 0;
    if(clear) {
        code_segments.push("[-]" + ">[-]".repeat(buffer_size - 1));
        curr_ind = buffer_size - 1;
    }

    let prev_value = 0;

    const moveTo = (ind: number) => {
        if(ind > curr_ind) {
            code_segments.push(">".repeat(ind - curr_ind));
        } else if(ind < curr_ind) {
            code_segments.push("<".repeat(curr_ind - ind));
        }

        curr_ind = ind;
    }

    const accToInd1 = (op: '+'|'-', amount: number) => {
        if(amount <= 0) return;
        if(amount < 15) {
            moveTo(1);
            code_segments.push(op.repeat(amount));
            return;
        }

        const batch = amount % 8 === 0 ? 8 : amount % 5 === 0 ? 5 : 8;
        const group = Math.floor(amount/batch);
        const remainder = amount % batch;

        moveTo(0);
        code_segments.push("+".repeat(batch), "[->" + op.repeat(group) + "<]");

        moveTo(1);
        code_segments.push(op.repeat(remainder));
    };

    for(const byte of bytes) {
        const diff = byte - prev_value;
        if(diff > 0) {
            accToInd1('+', diff);
        } else if(diff < 0) {
            accToInd1('-', -diff);
        }

        prev_value = byte;

        moveTo(1);
        code_segments.push(".");
    }

    moveTo(0);

    return code_segments.join("");
}

function generateBFStoreCode(bytes: BytesDataType, params: GenerateBFStoreParams): string {
    if(bytes.length === 0) {
        return "";
    }

    const code_segments: string[] = [];
    throw new Error("Not yet implemented");
}

export const ToBFLiteralPipe = definePipe<'bytes', 'string', ToBFLiteralParams>(
    {
        id: "to-bf-literal",
        name: "Bytes ⇨ BrainF**k",
        description: "Convert bytes to a BrainF**k literal.",

        inputType: 'bytes',
        outputType: 'string',
    },
    async ({value}: BytesRef, params): Promise<StringDataType> => {
        if(params.print) {
            return generateBFPrintCode(value, params);
        } else {
            return generateBFStoreCode(value, params);
        }
    },
    {
        print: true,
        buffer_size: 2,
        wraparound: true,
        clear: false,
    },
);