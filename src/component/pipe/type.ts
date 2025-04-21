import type { ComponentType } from "preact/compat";

export type StringDataType = string;
export type BytesDataType = Uint8Array;

export interface StringRef {
    type: 'string';
    value: StringDataType; // Maybe use Uint32Array instead of string?
}

export interface BytesRef {
    type: 'bytes';
    value: BytesDataType;
}

export type RefType = StringRef | BytesRef;
export type DataType = RefType['value'];

export type DataTypeName = "string" | "bytes" | "all" | "null";
export type ToRefType<T extends DataTypeName> = T extends "string" ? StringRef : T extends "bytes" ? BytesRef : T extends "all" ? RefType : null;
export type ToDataType<T extends DataTypeName> = T extends "string" ? StringDataType : T extends "bytes" ? BytesDataType : T extends "all" ? DataType : null;

export interface PipeFunction<InputTypeName extends DataTypeName = DataTypeName, OutputTypeName extends DataTypeName = DataTypeName> {
    (data: ToRefType<InputTypeName>): Promise<ToRefType<OutputTypeName>>;
}

export interface PipeFunctionWithParams<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName, ParamsType extends object> {
    (data: ToRefType<InputTypeName>, params: ParamsType): Promise<ToRefType<OutputTypeName>|ToDataType<OutputTypeName>>;
}

export interface PipeProps {
    inputValue?: RefType|null;
    onOutputChange?: (value: RefType) => void;

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