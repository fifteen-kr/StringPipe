import { ReverseStringPipe } from "../common";
import type { PipeCatalogCategory } from "./type";

export const PIPE_CATALOG_DATA = [
    {
        id: 'common',
        name: "Common",

        description: "Common Operations",
        entries: [
            {
                Component: ReverseStringPipe,

                id: 'reverse-string',
                name: "Reverse String",

                category: 'common',
                description: "Reverses a string.",

                inputType: 'string',
                outputType: 'string',
            },
        ],
    },
    {
        id: 'hash',
        name: "Hash",

        description: "Hash Function",
        entries: [],
    },
] as const satisfies PipeCatalogCategory[];