import type { PipeCategory } from "../type";
import { Base64DecodePipe, Base64EncodePipe } from "./base64";
import { UTFEncodePipe, UTFDecodePipe } from "./utf";

export const PIPES_ENCODING: PipeCategory = {
    id: 'encoding',
    name: 'Encoding',
    description: "Conversion between string and bytes.",

    pipes: [
        UTFEncodePipe,
        UTFDecodePipe,
        Base64EncodePipe,
        Base64DecodePipe,
    ],
};