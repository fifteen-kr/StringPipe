import { type } from "arktype";



const DataType = type(`"string"|"bytes"`);
export type DataType = typeof DataType.infer;

const PipeDefinition = type({
    id: "string",
    name: "string?",
    input: DataType,
    output: DataType,
});
export type PipeDefinition = typeof PipeDefinition.infer;

export interface PipeInstance {
    id: string;
    schema_id: string;
}