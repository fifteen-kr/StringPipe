import type { PipeCategory } from "../type";
import { DisplayPipe } from "./display";
import { WcPipe } from "./wc";
import { StatPipe } from "./stat";
import { ReversePipe } from "./reverse";
import { TrimStringPipe } from "./trim";
import { ChangeEndianPipe } from "./change-endian";

export const PIPES_MISC: PipeCategory = {
    id: 'misc',
    name: 'Miscellaneous',
    description: "Miscellaneous string and bytes manipulation.",

    pipes: [
        DisplayPipe,
        WcPipe,
        StatPipe,
        ReversePipe,
        TrimStringPipe,
        ChangeEndianPipe,
    ],
};