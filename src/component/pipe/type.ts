import type { ComponentType } from "preact/compat";

export type Bytes = Uint8Array; 
export type DataType = string | Bytes;
export type AsDataTypeDefinition<T extends DataType|null> = T extends null ? "null" : T extends string ? "string" : "bytes";

export interface PipeProps {
    inputValue?: DataType|null;
    onOutputChange?: (value: DataType) => void;

    onClickRemove?: () => void;
}

export type PipeComponentType = ComponentType<PipeProps>;

export interface PipeMetadata<InputType extends DataType|null, OutputType extends DataType> {
    id: string;
    name?: string;
    description?: string;

    inputType: AsDataTypeDefinition<InputType>;
    outputType: AsDataTypeDefinition<OutputType>;
}

export interface PipeDefinition<InputType extends DataType|null = DataType|null, OutputType extends DataType = DataType> extends PipeMetadata<InputType, OutputType> {
    Component: PipeComponentType;
}