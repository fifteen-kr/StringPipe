import type { BytesDataType, DataType, DataTypeName, StringDataType, ToDataType } from "./type"

export function isStringDataType(value: unknown): value is StringDataType {
    return typeof value === "string";
}

export function isBytesDataType(value: unknown): value is BytesDataType {
    if(!value) return false;
    return value instanceof Uint8Array;
}

export function validateValue<D extends DataTypeName>(data_type: D, value: unknown): value is ToDataType<D> {
    switch(data_type) {
        case "all": return isStringDataType(value) || isBytesDataType(value);
        case "string": return isStringDataType(value);
        case "bytes": return isBytesDataType(value);
        case "null": return value == null;
        default: return false;
    }
}

export function getDataTypeName(value: DataType|null|undefined, hint_type_name?: DataTypeName): DataTypeName {
    if(value == null) return hint_type_name === 'all' ? 'string' : (hint_type_name ?? 'null');
    if(isStringDataType(value)) return "string";
    if(isBytesDataType(value)) return "bytes";

    throw new Error(`Unknown data type: ${typeof value}`);
}

const DEFAULT_STRING: Readonly<StringDataType> = "";
const DEFAULT_BYTES: Readonly<BytesDataType> = new Uint8Array();

export function getDefaultData<D extends DataTypeName>(data_type: D): Readonly<ToDataType<D>> {
    switch(data_type) {
        case 'null': return null as ToDataType<D>;
        case 'string': return DEFAULT_STRING as ToDataType<D>;
        case 'bytes': return DEFAULT_BYTES as ToDataType<D>;
        case 'all': return DEFAULT_STRING as ToDataType<D>;
    }
}