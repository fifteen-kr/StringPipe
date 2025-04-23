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

function* generateAheuiNumber(n: number): Generator<string> {
    // Find a way to optimize code size...
    
    if(n < 0) {
        if(n >= -7) {
            yield `${AHEUI_NUMERALS[9+n]}${AHEUI_NUMERALS[9]}타`;``
        }

        yield* generateAheuiNumber(-n);
        yield* generateAheuiNumber(-1);
        yield "따";
        return;
    }

    if(0 <= n && n < AHEUI_NUMERALS.length) {
        yield AHEUI_NUMERALS[n];
        return;
    }

    if(n <= 18) {
        const x = n >> 1;
        yield* generateAheuiNumber(x);
        yield* generateAheuiNumber(n - x);
        yield "다";
        return;
    }

    const m = Math.floor(Math.sqrt(n));
    yield* generateAheuiNumber(m);
    yield "빠따"
    yield* generateAheuiNumber(n - m * m);
    yield "다";
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
        for(const char of iterateIntegerValues(input)) {
            result.push(...generateAheuiNumber(char), "맣");
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