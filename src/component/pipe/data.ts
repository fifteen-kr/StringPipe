import type { DataType, DataTypeName, ToDataType } from "./type";

export function validateValue<D extends DataTypeName>(data_type: D, value: unknown): value is ToDataType<D> {
    switch(data_type) {
        case "all": return typeof value === "string" || value instanceof Uint8Array;
        case "string": return typeof value === "string";
        case "bytes": return value instanceof Uint8Array;
        case "null": return value == null;
        default: return false;
    }
}

export function getDataTypeName(value: DataType|null|undefined, hint_type_name?: DataTypeName): DataTypeName {
    if(typeof value === "string") return "string";
    if(value instanceof Uint8Array) return "bytes";
    if(value == null) return hint_type_name === 'all' ? 'string' : (hint_type_name ?? 'null');

    throw new Error(`Unknown data type: ${typeof value}`);
}

export function getDefaultData<D extends DataTypeName>(data_type: D): ToDataType<D> {
    switch(data_type) {
        case 'null': return null as ToDataType<D>;
        case 'string': return "" as ToDataType<D>;
        case 'bytes': return new Uint8Array() as ToDataType<D>;
        case 'all': return "" as ToDataType<D>;
    }
}