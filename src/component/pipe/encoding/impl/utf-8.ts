import { EncodingMetadata } from "./type";

export const UTF_8: EncodingMetadata = {
    id: 'utf-8',
    name: "UTF-8",
    
    default_params: {},

    async encode(params, s) {
        throw new Error("Not yet implemented!");
    },

    async decode(params, bytes) {
        throw new Error("Not yet implemented!");
    },
};