import type { PipeCategory } from "../type";
import { RotPipe } from "./rot";

export * from "./rot";

export const PIPES_CIPHER: PipeCategory = {
    id: 'cipher',
    name: 'Cipher',
    description: "Pipes for encrypt/decrypt data.",

    pipes: [
        RotPipe,
    ],
};