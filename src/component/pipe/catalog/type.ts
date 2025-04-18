import type { AsDataTypeDefinition, DataType, PipeComponent } from "../type";

export interface PipeCatalogEntryMetadata<InputType extends DataType|null, OutputType extends DataType> {
    id: string;
    name?: string;

    category?: string;
    description?: string;

    inputType: AsDataTypeDefinition<InputType>;
    outputType: AsDataTypeDefinition<OutputType>;
}

export interface PipeCatalogEntry<InputType extends DataType|null = DataType|null, OutputType extends DataType = DataType> extends PipeCatalogEntryMetadata<InputType, OutputType> {
    Component: PipeComponent;
}

export interface PipeCatalogCategory {
    id: string;
    name?: string;

    description?: string;

    entries: PipeCatalogEntry[];
}