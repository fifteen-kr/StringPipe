import { useCallback, useId } from "preact/hooks";

import { definePipe } from "../base";
import { Bytes } from "../type";

const INT_LITERAL_TYPES = [
    {id: 'hex', name: 'Hexadecimal (0xAB)', prefix: "0x", base: 16},
    {id: 'dec', name: 'Decimal (171)', prefix: "", base: 10},
    {id: 'oct', name: 'Octal (0o253)', prefix: "0o", base: 8},
    {id: 'bin', name: 'Binary (0b10101011)', prefix: "0b", base: 2}
] as const;

type IntLiteralType = (typeof INT_LITERAL_TYPES)[number]['id'];

const INT_LITERAL_TYPE_BY_ID = new Map<IntLiteralType, (typeof INT_LITERAL_TYPES)[number]>(INT_LITERAL_TYPES.map((t) => [t.id, t]));

interface ToIntListParams {
    int_literal_type: IntLiteralType,
    attach_int_prefix: boolean,
    is_prefix_uppercase: boolean,
    is_uppercase: boolean,
    pad_zeros: boolean,

    separator: string;
    prefix: string;
    postfix: string;
}

function valueToIntList(value: string|Bytes): number[] {
    if(typeof value === 'string') {
        return Array.from(value).map(c => c.codePointAt(0) ?? 0);
    } else {
        return Array.from(value);
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
    async (input: string|Bytes, params: ToIntListParams): Promise<string> => {
        const int_list = valueToIntList(input);
        const int_literal_type = INT_LITERAL_TYPE_BY_ID.get(params.int_literal_type)!;

        let pad_zero_mul = 0;
        if(params.pad_zeros) pad_zero_mul = int_literal_type.base === 16 ? 2 : int_literal_type.base === 2 ? 8 : 0;

        return `${params.prefix}${int_list.map((v) => {
            let digits = v.toString(int_literal_type.base);
            if(params.is_uppercase) digits = digits.toUpperCase();
            if(pad_zero_mul > 1) {
                let rem = digits.length % pad_zero_mul;
                if(rem !== 0) digits = digits.padStart(digits.length + pad_zero_mul - rem, '0');
            }

            if(!params.attach_int_prefix) return digits;

            const prefix = int_literal_type.prefix;
            return `${params.is_prefix_uppercase ? prefix.toUpperCase() : prefix}${digits}`;
        }).join(params.separator)}${params.postfix}`;
    },
    {
        int_literal_type: 'dec',
        attach_int_prefix: true,
        is_prefix_uppercase: false,
        is_uppercase: true,
        pad_zeros: true,

        separator: ", ",
        prefix: "[",
        postfix: "]",
    },
    ({params, onChangeParams}) => {
        const handleOnChangeIntLiteralType = useCallback((int_literal_type: ToIntListParams['int_literal_type']) => {
            onChangeParams({int_literal_type});
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

        const {int_literal_type} = params;

        return <>
            <div className="sp-pipe-params-row">
                <IntLiteralTypeSelect value={params.int_literal_type} onChange={handleOnChangeIntLiteralType}/>
            </div>
            <div className="sp-pipe-params-row">
                { (int_literal_type !== 'dec') &&<label><input type="checkbox" checked={params.attach_int_prefix} onChange={handleOnChangeAttachIntPrefix}/> Attach Int Prefix</label> }
                { (int_literal_type !== 'dec') && <label><input type="checkbox" checked={params.is_prefix_uppercase} onChange={handleOnChangeIsPrefixUppercase}/> Uppercase Prefix</label> }
                { (int_literal_type === 'hex') && <label><input type="checkbox" checked={params.is_uppercase} onChange={handleOnChangeIsUppercase}/> Uppercase Int</label> }
                { (int_literal_type === 'hex' || int_literal_type === 'bin') && <label><input type="checkbox" checked={params.pad_zeros} onChange={handleOnChangePadZeros}/> Pad Zeros</label> }
            </div>
            <div className="sp-pipe-params-row">
                <label>Separator: <input type="text" size={3} value={params.separator} onInput={handleOnChangeSeparator}/></label>
                <label>Prefix: <input type="text" size={2} value={params.prefix} onInput={handleOnChangePrefix}/></label>
                <label>Postfix: <input type="text" size={2} value={params.postfix} onInput={handleOnChangePostfix}/></label>
            </div>
        </>;
    },
);

interface IntLiteralTypeSelectProps {
    value: IntLiteralType;
    onChange: (value: IntLiteralType) => void;
}

function IntLiteralTypeSelect({value, onChange}: IntLiteralTypeSelectProps) {
    const group_id = useId();

    // Create a list of radio buttons.
    return <>
        {INT_LITERAL_TYPES.map((type_def) => {
            return <label key={type_def.id}>
                <input type="radio" name={group_id} value={type_def.id} checked={value === type_def.id} onChange={() => onChange(type_def.id)}/>
                &nbsp;{type_def.name}
            </label>;
        })}
    </>;
}