import type { PipeCategory } from "../type";
import { ReverseStringPipe } from "./reverse";
import { ShowBytesPipe, ShowStringPipe } from "./show";
import { TrimStringPipe } from "./trim";

export * from "./trim";
export * from "./reverse";
export * from "./show";

export const PIPES_MISC: PipeCategory = {
    id: 'misc',
    name: 'Miscellaneous',
    description: "Miscellaneous string and bytes manipulation.",

    entries: [
        ShowStringPipe,
        ShowBytesPipe,
        ReverseStringPipe,
        TrimStringPipe,
    ],
};