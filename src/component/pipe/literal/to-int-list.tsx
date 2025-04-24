import { useCallback, useId } from "preact/hooks";

import { definePipe } from "../base";
import { RefType, StringDataType } from "../type";
import { isStringDataType } from "../data";

import { INT_RADIX_DATA, INT_RADIX_DATA_BY_ID, IntRadixType, SelectIntRadix } from "./int-radix";

interface ToIntListParams {
    int_radix: IntRadixType
    attach_int_prefix: boolean,
    is_prefix_uppercase: boolean,
    is_uppercase: boolean,
    pad_zeros: boolean,

    separator: string;
    prefix: string;
    postfix: string;
}

function valueToIntList(data: RefType): number[] {
    if(isStringDataType(data)) {
        return Array.from(data.value).map(c => c.codePointAt(0) ?? 0);
    } else {
        return Array.from(data.value);
    }
}

export const ToIntListPipe = definePipe<'all', 'string', ToIntListParams>(
    {
        id: "to-int-list",
        name: "Data ⇨ Int List",
        description: "Convert the value to a list of integers.",

        inputType: 'all',
        outputType: 'string',
    },
    async (input: RefType, params: ToIntListParams): Promise<StringDataType> => {
        const int_list = valueToIntList(input);
        const int_radix = INT_RADIX_DATA_BY_ID.get(params.int_radix)!;

        let pad_zero_mul = 0;
        if(params.pad_zeros) pad_zero_mul = int_radix.base === 16 ? 2 : int_radix.base === 2 ? 8 : 0;

        return `${params.prefix}${int_list.map((v) => {
            let digits = v.toString(int_radix.base);
            if(params.is_uppercase) digits = digits.toUpperCase();
            if(pad_zero_mul > 1) {
                let rem = digits.length % pad_zero_mul;
                if(rem !== 0) digits = digits.padStart(digits.length + pad_zero_mul - rem, '0');
            }

            if(!params.attach_int_prefix) return digits;

            const prefix = int_radix.prefix;
            return `${params.is_prefix_uppercase ? prefix.toUpperCase() : prefix}${digits}`;
        }).join(params.separator)}${params.postfix}`;
    },
    {
        int_radix: 'dec',
        attach_int_prefix: true,
        is_prefix_uppercase: false,
        is_uppercase: true,
        pad_zeros: true,

        separator: ", ",
        prefix: "[",
        postfix: "]",
    },
    ({params, onChangeParams}) => {
        const handleOnChangeIntLiteralType = useCallback((int_radix: IntRadixType) => {
            onChangeParams({int_radix});
        }, [onChangeParams]);

        const handleOnChangeAttachIntPrefix = useCallback((e: Event) => {
            onChangeParams({attach_int_prefix: (e.currentTarget as HTMLInputElement).checked});
        }, [onChangeParams]);

        const handleOnChangeIsPrefixUppercase = useCallback((e: Event) => {
            onChangeParams({is_prefix_uppercase: (e.currentTarget as HTMLInputElement).checked});
        }, [onChangeParams]);

        const handleOnChangeIsUppercase = useCallback((e: Event) => {
            onChangeParams({is_uppercase: (e.currentTarget as HTMLInputElement).checked});
        }, [onChangeParams]);

        const handleOnChangePadZeros = useCallback((e: Event) => {
            onChangeParams({pad_zeros: (e.currentTarget as HTMLInputElement).checked});
        }, [onChangeParams]);

        const handleOnChangeSeparator = useCallback((e: Event) => {
            onChangeParams({separator: (e.currentTarget as HTMLInputElement).value});
        }, [onChangeParams]);

        const handleOnChangePrefix = useCallback((e: Event) => {
            onChangeParams({prefix: (e.currentTarget as HTMLInputElement).value});
        }, [onChangeParams]);

        const handleOnChangePostfix = useCallback((e: Event) => {
            onChangeParams({postfix: (e.currentTarget as HTMLInputElement).value});
        }, [onChangeParams]);

        const {int_radix} = params;

        return <>
            <div className="sp-pipe-params-row">
                <SelectIntRadix value={params.int_radix} onChange={handleOnChangeIntLiteralType}/>
            </div>
            <div className="sp-pipe-params-row">
                { (int_radix !== 'dec') &&<label><input type="checkbox" checked={params.attach_int_prefix} onChange={handleOnChangeAttachIntPrefix}/> Attach Int Prefix</label> }
                { (int_radix !== 'dec') && <label><input type="checkbox" checked={params.is_prefix_uppercase} onChange={handleOnChangeIsPrefixUppercase}/> Uppercase Prefix</label> }
                { (int_radix === 'hex') && <label><input type="checkbox" checked={params.is_uppercase} onChange={handleOnChangeIsUppercase}/> Uppercase Int</label> }
                { (int_radix === 'hex' || int_radix === 'bin') && <label><input type="checkbox" checked={params.pad_zeros} onChange={handleOnChangePadZeros}/> Pad Zeros</label> }
            </div>
            <div className="sp-pipe-params-row">
                <label>Separator: <input type="text" size={3} value={params.separator} onInput={handleOnChangeSeparator}/></label>
                <label>Prefix: <input type="text" size={2} value={params.prefix} onInput={handleOnChangePrefix}/></label>
                <label>Postfix: <input type="text" size={2} value={params.postfix} onInput={handleOnChangePostfix}/></label>
            </div>
        </>;
    },
);
