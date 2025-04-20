import type { PipeCategory } from "../type";
import { ReversePipe } from "./reverse";
import { DisplayPipe } from "./display";
import { TrimStringPipe } from "./trim";

export * from "./trim";
export * from "./reverse";
export * from "./display";

export const PIPES_MISC: PipeCategory = {
    id: 'misc',
    name: 'Miscellaneous',
    description: "Miscellaneous string and bytes manipulation.",

    entries: [
        DisplayPipe,
        ReversePipe,
        TrimStringPipe,
    ],
};