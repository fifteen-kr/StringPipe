import type { ComponentType } from "preact/compat";

export type StringDataType = string;
export type BytesDataType = Uint8Array;
export type DataType = StringDataType | BytesDataType;
export type DataTypeName = "string" | "bytes" | "all" | "null";
export type ToDataType<T extends DataTypeName> = T extends "string" ? StringDataType : T extends "bytes" ? BytesDataType : T extends "all" ? DataType : null;

export interface PipeFunction<InputTypeName extends DataTypeName = DataTypeName, OutputTypeName extends DataTypeName = DataTypeName> {
    (input: ToDataType<InputTypeName>): Promise<ToDataType<OutputTypeName>>;
}

export interface PipeFunctionWithParams<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName, ParamsType extends object> {
    (input: ToDataType<InputTypeName>, params: ParamsType): Promise<ToDataType<OutputTypeName>>;
}

export interface PipeProps {
    inputValue?: DataType|null;
    onOutputChange?: (value: DataType) => void;

    onClickRemove?: () => void;
}

export type PipeComponentType = ComponentType<PipeProps>;

export interface PipeMetadata<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName> {
    id: string;
    name?: string;
    description?: string;

    inputType: InputTypeName;
    outputType: OutputTypeName;
}

export interface PipeDefinition<InputTypeName extends DataTypeName = DataTypeName, OutputTypeName extends DataTypeName = DataTypeName> extends PipeMetadata<InputTypeName, DataTypeName> {
    Component: PipeComponentType;
}

export interface PipeCategoryMetadata {
    id: string;
    name?: string;
    description?: string;
}

export interface PipeCategory extends PipeCategoryMetadata {
    pipes: PipeDefinition[];
}