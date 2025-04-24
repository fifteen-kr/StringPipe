import { useId } from "preact/hooks";

export const INT_RADIX_DATA = [
    {id: 'hex', name: 'Hexadecimal (0xF)', prefix: "0x", base: 16},
    {id: 'dec', name: 'Decimal (15)', prefix: "", base: 10},
    {id: 'oct', name: 'Octal (0o17)', prefix: "0o", base: 8},
    {id: 'bin', name: 'Binary (0b1111)', prefix: "0b", base: 2}
] as const;

export type IntRadixType = (typeof INT_RADIX_DATA)[number]['id'];

export const INT_RADIX_DATA_BY_ID = new Map<IntRadixType, (typeof INT_RADIX_DATA)[number]>(INT_RADIX_DATA.map((t) => [t.id, t]));

export interface SelectIntRadixProps {
    value: IntRadixType;
    onChange: (value: IntRadixType) => void;
}

export function SelectIntRadix({value, onChange}: SelectIntRadixProps) {
    const group_id = useId();

    // Create a list of radio buttons.
    return <>
        {INT_RADIX_DATA.map((type_def) => {
            return <label key={type_def.id}>
                <input type="radio" name={group_id} value={type_def.id} checked={value === type_def.id} onChange={() => onChange(type_def.id)}/>
                &nbsp;{type_def.name}
            </label>;
        })}
    </>;
}