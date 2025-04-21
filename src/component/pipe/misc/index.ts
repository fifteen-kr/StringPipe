import type { PipeCategory } from "../type";
import { DisplayPipe } from "./display";
import { WcPipe } from "./wc";
import { ReversePipe } from "./reverse";
import { TrimStringPipe } from "./trim";

export const PIPES_MISC: PipeCategory = {
    id: 'misc',
    name: 'Miscellaneous',
    description: "Miscellaneous string and bytes manipulation.",

    pipes: [
        DisplayPipe,
        WcPipe,
        ReversePipe,
        TrimStringPipe,
    ],
};