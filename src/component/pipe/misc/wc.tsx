import { useCallback } from "preact/hooks";

import type { BytesDataType, DataType, StringDataType } from "../type";
import { definePipe } from "../base";

import { StringView } from "@/component/data-view";

interface WcParams {
    auto_trailing_newline: boolean;
}

interface WcResult {
    chars: number;
    words: number;
    lines: number;
}

function wcString(input: StringDataType, params: WcParams): WcResult {
    let chars = 0;
    let words = 0;
    let lines = 0;
    let in_word = false;

    for(const ch of input) {
        ++chars;
        if(ch === '\n') ++lines;

        if(/\s/.test(ch)) {
            if(in_word) {
                ++words;
                in_word = false;
            }
        } else {
            in_word = true;
        }
    }

    if(in_word) ++words;
    if(params.auto_trailing_newline && (input.length === 0 || input[input.length - 1] !== '\n')) ++lines;
    
    return {chars, words, lines};
}

function wcBytes(input: BytesDataType, params: WcParams): WcResult {
    let chars = 0;
    let words = 0;
    let lines = 0;
    let in_word = false;
    
    for(const byte of input) {
        ++chars;
        if(byte === 0x0A) ++lines;

        if(byte === 0x09 || byte === 0x0A || byte === 0x0B || byte === 0x0C || byte === 0x0D || byte === 0x20) {
            if(in_word) {
                ++words;
                in_word = false;
            }
        } else {
            in_word = true;
        }
    }

    if(in_word) ++words;
    if(params.auto_trailing_newline && (input.length === 0 || input[input.length - 1] !== 0x0A)) ++lines;

    return {chars, words, lines};
}

export const WcPipe = definePipe<'all', 'all', WcParams>(
    {
        id: "wc",
        name: "Word/Line Count",
        description: "Count the number of words and lines in the input.",

        inputType: 'all',
        outputType: 'all',
    },
    (input: DataType) => Promise.resolve(input),
    {
        auto_trailing_newline: true,
    },
    ({params, onChangeParams}) => {
        const handleOnChangeAutoTrailingNewline = useCallback((e: Event) => {
            onChangeParams({auto_trailing_newline: (e.currentTarget as HTMLInputElement).checked});
        }, [onChangeParams])
        return <div><label>Add Trailing Newline if Missing: <input type="checkbox" checked={params.auto_trailing_newline} onChange={handleOnChangeAutoTrailingNewline} /></label></div>;
    },
    (params) => ({value}) => {
        const result: WcResult = (typeof value === 'string') ? wcString(value, params) : wcBytes(value, params);
        return <StringView value={`Lines: ${result.lines}, Words: ${result.words}, Chars: ${result.chars}`}/>
    },
);