import type { RefType } from "../type";
import { definePipe } from "../base";
import { StringView } from "@/component/data-view";
import { escapeConfusingCharacters } from "@/util";

interface StatParams {}

export const StatPipe = definePipe<'all', 'all', StatParams>(
    {
        id: 'stat',
        name: "Statistics",
        description: "Count characters / bytes in the input.",

        inputType: 'all',
        outputType: 'all',
    },
    (input: RefType) => Promise.resolve(input),
    {},
    () => null,
    (params) => ({data}) => {
        let report: string = "";
        switch(data.type) {
            case 'string': {
                const count = new Map<string, number>();
                for(const char of data.value) {
                    count.set(char, (count.get(char) ?? 0) + 1);
                }

                report = [...count.entries()].sort(([c1], [c2]) => c1.localeCompare(c2)).map(([char, count]) => `${escapeConfusingCharacters(char)}: ${count}`).join('\n');

                break;
            }
            case 'bytes': {
                const count = new Map<number, number>();
                for(const byte of data.value) {
                    count.set(byte, (count.get(byte) ?? 0) + 1);
                }

                report = [...count.entries()].sort(([b1], [b2]) => b1 - b2).map(([byte, count]) => `${byte}: ${count}`).join('\n');
                break;
            }
        }
        return <StringView data={{type: 'string', value: report}}/>
    },
);