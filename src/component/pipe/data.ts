import type { BytesDataType, DataType, DataTypeName, StringDataType, ToDataType, ToUnderlyingDataType, UnderlyingDataType } from "./type"

export function isStringDataType(value: DataType|null|undefined): value is StringDataType {
    if(!value) return false;
    return value.type === 'string';
}

export function isBytesDataType(value: DataType|null|undefined): value is BytesDataType {
    if(!value) return false;
    return value.type === 'bytes';
}

export function validateValue<D extends DataTypeName>(data_type: D, value: DataType|null|undefined): value is ToDataType<D> {
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

export const DEFAULT_STRING: Readonly<StringDataType> = { type: 'string', value: "" };
export const DEFAULT_BYTES: Readonly<BytesDataType> = { type: 'bytes', value: new Uint8Array() };

export function getDefaultData<D extends DataTypeName>(data_type: D): Readonly<ToDataType<D>> {
    switch(data_type) {
        case 'null': return null as ToDataType<D>;
        case 'string': return DEFAULT_STRING as ToDataType<D>;
        case 'bytes': return DEFAULT_BYTES as ToDataType<D>;
        case 'all': return DEFAULT_STRING as ToDataType<D>;
    }
}

export function normalizeData<D extends DataTypeName>(data_type: ToDataType<D>|ToUnderlyingDataType<D>): ToDataType<D>;
export function normalizeData<D extends DataTypeName>(data_type: ToDataType<D>|ToUnderlyingDataType<D>|null|undefined): ToDataType<D>|null;
export function normalizeData<D extends DataTypeName>(data_type: ToDataType<D>|ToUnderlyingDataType<D>|null|undefined): ToDataType<D>|null {
    if(data_type == null) return null;

    if(typeof data_type === 'string') return { type: 'string', value: data_type } as ToDataType<D>;
    if(data_type instanceof Uint8Array) return { type: 'bytes', value: data_type } as ToDataType<D>;
    
    if(!(typeof data_type === 'object' && 'type' in data_type && 'value' in data_type)) throw new Error(`Invalid data type: ${typeof data_type}`);
    return data_type as ToDataType<D>;
}