import type { PipeCategory } from "../type";
import { UnicodeDecodePipe, UnicodeEncodePipe } from "./unicode";

export * from "./base64";
export * from "./unicode";

export const PIPES_ENCODING: PipeCategory = {
    id: 'encoding',
    name: 'Encoding',
    description: "Conversion between string and bytes.",

    entries: [
        UnicodeEncodePipe,
        UnicodeDecodePipe,
    ],
};