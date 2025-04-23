import type { BytesRef, StringRef, BytesDataType, StringDataType } from "../type";
import { definePipe } from "../base";

import type { UTF8EncodingParams, UTF8DecodingParams, UTFEncodingType } from "./impl/utf";
import { UTF_8_ENCODING } from "./impl/utf";
import { UTF_16_ENCODING } from "./impl/utf/utf-16";

export interface UTFEncodeParams extends UTF8EncodingParams {
    encoding: UTFEncodingType;
    endian: 'big'|'little';
}

export const UTFEncodePipe = definePipe<'string', 'bytes', UTFEncodeParams>(
    {
        id: "utf-encode",
        name: "UTF Encode",
        description: "Encode a string to UTF-encoded bytes.",

        inputType: 'string',
        outputType: 'bytes',
    },
    async ({value}: StringRef, params): Promise<BytesDataType> => {
        const {encoding} = params;

        switch(encoding) {
            case 'utf-8': return await UTF_8_ENCODING.encode(value, params);
            case 'utf-16': return await UTF_16_ENCODING.encode(value, params);
            default: throw new Error(`Unsupported encoding: '${encoding}'`);
        }
    },
    {
        encoding: "utf-8",
        transform_nul: false,
        use_surrogate_pairs: false,
        endian: 'little',
    },
    ({params, onChangeParams}) => {
        return <>
            <div className="sp-pipe-params-row">
                <label>
                    Encoding: <select value={params.encoding} onChange={e => onChangeParams({encoding: e.currentTarget!.value as UTFEncodingType})}>
                        <option value="utf-8">UTF-8</option>
                        <option value="utf-16">UTF-16</option>
                        <option value="utf-32" disabled>UTF-32</option>
                        <optgroup label="Legacy">
                            <option value="utf-1" disabled>UTF-1</option>
                            <option value="utf-5" disabled>UTF-5</option>
                            <option value="utf-6" disabled>UTF-6</option>
                            <option value="utf-7" disabled>UTF-7</option>
                            <option value="utf-ebcdic" disabled>UTF-EBCDIC</option>
                        </optgroup>
                    </select>
                </label>
                {
                    (params.encoding === 'utf-16' || params.encoding === 'utf-32') && <>
                        <label><input type="radio" checked={params.endian === 'big'} onChange={e => onChangeParams({endian: 'big'})}/> Big Endian</label>
                        <label><input type="radio" checked={params.endian === 'little'} onChange={e => onChangeParams({endian: 'little'})}/> Little Endian</label>
                    </>
                }
            </div>
            {
                params.encoding === 'utf-8' && <div className="sp-pipe-params-row">
                    <label><input type="checkbox" checked={params.transform_nul} onChange={e => onChangeParams({transform_nul: e.currentTarget!.checked})}/> Encode NUL as C0 80 (MUTF-8)</label>
                    <label><input type="checkbox" checked={params.use_surrogate_pairs} onChange={e => onChangeParams({use_surrogate_pairs: e.currentTarget!.checked})}/> Use surrogate pairs (MUTF-8, CESU-8)</label>
                </div>
            }
        </>;
    }, 
);

export interface UTFDecodeParams extends UTF8DecodingParams {
    encoding: UTFEncodingType;
    endian: 'big'|'little';
}

export const UTFDecodePipe = definePipe<'bytes', 'string', UTFDecodeParams>(
    {
        id: "utf-decode",
        name: "UTF Decode",
        description: "Decode UTF-encoded bytes into a string.",

        inputType: 'bytes',
        outputType: 'string',
    },
    async ({value}: BytesRef, params): Promise<StringDataType> => {
        const {encoding} = params;

        switch(encoding) {
            case 'utf-8': return await UTF_8_ENCODING.decode(value, params);
            case 'utf-16': return await UTF_16_ENCODING.decode(value, params);
            default: throw new Error(`Unsupported encoding: '${encoding}'`);
        }
    },
    {
        encoding: "utf-8",
        on_untranslatable: "replace",
        allow_incorrect_length: false,
        combine_surrogate_pairs: false,
        endian: 'little',
    },
);