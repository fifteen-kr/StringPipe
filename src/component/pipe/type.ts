import type { ComponentType } from "preact/compat";

export type UnderlyingStringDataType = string;
export type UnderlyingBytesDataType = Uint8Array;

export interface StringDataType {
    type: 'string';
    value: UnderlyingStringDataType; // Maybe use Uint32Array instead of string?
}

export interface BytesDataType {
    type: 'bytes';
    value: UnderlyingBytesDataType;
}

export type DataType = StringDataType | BytesDataType;
export type UnderlyingDataType = DataType['value'];

export type DataTypeName = "string" | "bytes" | "all" | "null";
export type ToDataType<T extends DataTypeName> = T extends "string" ? StringDataType : T extends "bytes" ? BytesDataType : T extends "all" ? DataType : null;
export type ToUnderlyingDataType<T extends DataTypeName> = T extends "string" ? UnderlyingStringDataType : T extends "bytes" ? UnderlyingBytesDataType : T extends "all" ? UnderlyingDataType : null;

export interface PipeFunction<InputTypeName extends DataTypeName = DataTypeName, OutputTypeName extends DataTypeName = DataTypeName> {
    (input: ToDataType<InputTypeName>): Promise<ToDataType<OutputTypeName>>;
}

export interface PipeFunctionWithParams<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName, ParamsType extends object> {
    (input: ToDataType<InputTypeName>, params: ParamsType): Promise<ToDataType<OutputTypeName>|ToUnderlyingDataType<OutputTypeName>>;
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