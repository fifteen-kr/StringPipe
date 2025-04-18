import type { FunctionComponent } from "preact/compat";

export type Bytes = Uint8Array;
export type DataType = string | Bytes;
export type AsDataTypeDefinition<T extends DataType|null> = T extends null ? "null" : T extends string ? "string" : "bytes";

export interface PipeProps {
    inputValue?: DataType;
    onOutputChange?: (value: DataType) => void;
}

export type PipeComponent = FunctionComponent<PipeProps>;