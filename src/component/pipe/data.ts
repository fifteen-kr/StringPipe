import type { BytesRef, RefType, DataTypeName, StringRef, ToRefType, ToDataType, DataType } from "./type"

export function isStringDataType(value: RefType|null|undefined): value is StringRef {
    if(!value) return false;
    return value.type === 'string';
}

export function isBytesDataType(value: RefType|null|undefined): value is BytesRef {
    if(!value) return false;
    return value.type === 'bytes';
}

export function validateValue<D extends DataTypeName>(data_type: D, value: RefType|null|undefined): value is ToRefType<D> {
    switch(data_type) {
        case "all": return isStringDataType(value) || isBytesDataType(value);
        case "string": return isStringDataType(value);
        case "bytes": return isBytesDataType(value);
        case "null": return value == null;
        default: return false;
    }
}

export function* iterateIntegerValues(value: RefType|null|undefined): Generator<number> {
    if(value == null) return;

    if(isStringDataType(value)) {
        for(const char of value.value) {
            yield char.codePointAt(0)!;
        }
    } else {
        yield* value.value;
    }
}

export function getDataTypeName(value: RefType|null|undefined, hint_type_name?: DataTypeName): DataTypeName {
    if(value == null) return hint_type_name === 'all' ? 'string' : (hint_type_name ?? 'null');
    if(isStringDataType(value)) return "string";
    if(isBytesDataType(value)) return "bytes";

    throw new Error(`Unknown data type: ${typeof value}`);
}

export const DEFAULT_STRING: Readonly<StringRef> = { type: 'string', value: "" };
export const DEFAULT_BYTES: Readonly<BytesRef> = { type: 'bytes', value: new Uint8Array() };

export function getDefaultData<D extends DataTypeName>(data_type: D): Readonly<ToRefType<D>> {
    switch(data_type) {
        case 'null': return null as ToRefType<D>;
        case 'string': return DEFAULT_STRING as ToRefType<D>;
        case 'bytes': return DEFAULT_BYTES as ToRefType<D>;
        case 'all': return DEFAULT_STRING as ToRefType<D>;
    }
}

export function normalizeData<D extends DataTypeName>(data_type: ToRefType<D>|ToDataType<D>): ToRefType<D>;
export function normalizeData<D extends DataTypeName>(data_type: ToRefType<D>|ToDataType<D>|null|undefined): ToRefType<D>|null;
export function normalizeData<D extends DataTypeName>(data_type: ToRefType<D>|ToDataType<D>|null|undefined): ToRefType<D>|null {
    if(data_type == null) return null;

    if(typeof data_type === 'string') return { type: 'string', value: data_type } as ToRefType<D>;
    if(data_type instanceof Uint8Array) return { type: 'bytes', value: data_type } as ToRefType<D>;
    
    if(!(typeof data_type === 'object' && 'type' in data_type && 'value' in data_type)) throw new Error(`Invalid data type: ${typeof data_type}`);
    return data_type as ToRefType<D>;
}