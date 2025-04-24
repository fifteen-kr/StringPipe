import { definePipe } from "../base";
import { iterateIntegerValues } from "../data";
import { RefType, StringDataType } from "../type";

export interface ToAheuiLiteralParams {
    print: true;
    stack: true;
    terminate: true;
}

const AHEUI_NUMERALS = [
    "반반타",
    "발밤타",
    "반",
    "받",
    "밤",
    "발",
    "밦",
    "밝",
    "밣",
    "밞",
];

type AheuiStrat = 'numeral' | 'add' | 'mul' | 'dupe-add-mul';

/**
 * Returns a strategy to create a non-negative integer `n`.
 * This code returns an optimal strategy for n <= 256.
 * 
 * @param n Number to create.
 */
function getAheuiStrat(n: number): [strat_type: AheuiStrat, arg0: number, arg1?: number] {
    if(n < AHEUI_NUMERALS.length) return ['numeral', n];
    if(n <= (AHEUI_NUMERALS.length-1)*2) return ['add', n>>1];
    if(n < 100) {
        for(let d = 9; d*d >= n; --d) {
            if(n%d === 0) return ['mul', d];
        }
        
        for(let v=2; v<10; ++v) {
            for(let d=9; d*d >= n-v; --d) {
                if((n-v)%d === 0) {
                    return ['mul', d, v];
                }
            }
        }

        // For 96, 98, and 99
        for(let d=9; d>=7; --d) {
            if(n%d === 0) {
                return ['mul', d];
            }
        }
    }

    if([111, 133, 134, 145, 158, 168, 184, 185, 186, 192, 207, 215, 216, 224, 235, 236, 237, 242, 252].includes(n)) {
        for(let d = 9; d >= 2; --d) {
            if(n%d === 0) return ['mul', d];
        }
    }
    
    switch(n) {
        case 181:
            return ['add', -8];
        case 157: case 211:
            return ['add', -5];
        case 239:
            return ['add', -4];
        case 159:
            return ['add', -3];
        case 214: case 241:
            return ['add', -2];
        case 101: case 122: case 127: case 155: case 170: case 212: case 226:
            return ['add', 2];
        case 183: case 213: case 246:
            return ['add', 3];
        case 179: case 244:
            return ['add', 4];
        case 131:
            return ['add', 5];
        case 206:
            return ['add', 6];
        case 209:
            return ['dupe-add-mul', 11, 8];
        case 197:
            return ['add', 8];
    }

    const sqrt = Math.round(Math.sqrt(n));
    const nearest_sq = sqrt ** 2;
    
    if(nearest_sq === n) return ['dupe-add-mul', sqrt];

    if(n%10 || n < 140) {
        for(let d = 18; d*d >= n; --d) {
            if(n%d === 0) return ['mul', d];
        }
    }

    for(let d = 9; d**3 >= n; --d) {
        if(n%d) continue;
        
        const v = n/d;
        for(let w=5; w<=9; ++w) {
            if(v%w === 0) return ['mul', d];
        }
    }

    return ['dupe-add-mul', sqrt];
}

/**
 * Attempts to find an Aheui code that puts the given integer on the stack.
 * 
 * @param n The number to put on the stack.
 * @returns An Aheui code which puts `n` on the stack.
 */
function* generateAheuiNumber(n: number): Generator<string> {
    // Find a way to optimize code size...
    
    if(n < 0) {
        if(n >= -7) {
            yield `${AHEUI_NUMERALS[9+n]}${AHEUI_NUMERALS[9]}타`;
        }

        yield "반";
        yield* generateAheuiNumber(2-n);
        yield "타";
        return;
    }

    const [strat, arg0, arg1=0] = getAheuiStrat(n);
    switch(strat) {
        case 'numeral': {
            yield AHEUI_NUMERALS[arg0];
            return;
        }
        case 'add': {
            yield* generateAheuiNumber(n - arg0);
            if(arg0 > 0) {
                yield* generateAheuiNumber(arg0);
                yield "다";
            } else if(arg0 < 0) {
                yield* generateAheuiNumber(-arg0);
                yield "타";
            }
            return;
        }
        case 'mul': {
            const d = Math.floor(n - arg1) / arg0;
            yield* generateAheuiNumber(d);
            yield* generateAheuiNumber(arg0);
            yield "따";

            const r = n - d*arg0;
            if(r) {
                yield* generateAheuiNumber(r);
                yield "다";
            }
            return;
        }
        case 'dupe-add-mul': {
            yield* generateAheuiNumber(arg0);
            yield "빠";

            if(arg1 > 0) {
                yield* generateAheuiNumber(arg1);
                yield "다";
            } else if(arg1 < 0) {
                yield* generateAheuiNumber(arg1);
                yield "타";
            }

            yield "따";
        
            const r = n - arg0*(arg0 + arg1);
            if(r > 0) {
                yield* generateAheuiNumber(r);
                yield "다";
            } else if(r < 0) {
                yield* generateAheuiNumber(-r);
                yield "타";
            }

            return;
        }
    }
}

export const ToAheuiLiteralPipe = definePipe<'all', 'string', ToAheuiLiteralParams>(
    {
        id: "to-aheui-literal",
        name: "Data ⇨ Aheui",
        description: "Convert data to an Aheui literal.",

        inputType: 'all',
        outputType: 'string',
    },
    async (input: RefType, params): Promise<StringDataType> => {
        const result: string[] = [];

        let prev_char: number|null = null;
        for(const char of iterateIntegerValues(input)) {
            if(prev_char == null) {
                result.push(...generateAheuiNumber(char));
                prev_char = char;
                continue;
            }

            const gen_from_scratch = ["맣", ...generateAheuiNumber(char)].join("");
            const diff = char - prev_char;
            const dup_prev = ["빠맣"];

            if(diff > 0) {
                dup_prev.push(...generateAheuiNumber(diff), "다");
            } else if(diff < 0) {
                dup_prev.push(...generateAheuiNumber(-diff), "타");
            }

            const dup_prev_code = dup_prev.join("");
            if(dup_prev_code.length < gen_from_scratch.length) {
                result.push(dup_prev_code);
            } else {
                result.push(gen_from_scratch);
            }
            
            prev_char = char;
        }

        if(prev_char != null) {
            result.push('맣');
        }

        if(params.terminate) {
            result.push("희");
        }

        return result.join("");
    },
    {
        print: true,
        stack: true,
        terminate: true,
    }
);