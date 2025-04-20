import type { PipeCategory } from "../type";
import { Base64DecodePipe, Base64EncodePipe } from "./base64";
import { UnicodeDecodePipe, UnicodeEncodePipe } from "./unicode";

export * from "./base64";
export * from "./unicode";

export const PIPES_ENCODING: PipeCategory = {
    id: 'encoding',
    name: 'Encoding',
    description: "Conversion between string and bytes.",

    pipes: [
        UnicodeEncodePipe,
        UnicodeDecodePipe,
        Base64EncodePipe,
        Base64DecodePipe,
    ],
};