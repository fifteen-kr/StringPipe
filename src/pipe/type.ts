export type Bytes = Uint8Array;
export type DataType = string | Bytes;
export type AsDataTypeDefinition<T extends DataType> = T extends string ? "string" : "bytes";