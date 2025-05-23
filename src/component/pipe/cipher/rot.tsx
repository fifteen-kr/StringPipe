import type { RefType } from "../type";
import { definePipe } from "../base";
import { useCallback } from "preact/hooks";
import { isStringDataType } from "../data";

function rotChar(ch: number, amount: number): number {
    if(ch >= 65 && ch <= 90) return (ch - 65 + amount) % 26 + 65;
    if(ch >= 97 && ch <= 122) return (ch - 97 + amount) % 26 + 97;
    return ch;
}

export const RotPipe = definePipe(
    {
        id: "rot",
        name: "ROT Cipher",
        description: "ROT cipher.",

        inputType: 'all',
        outputType: 'all',
    },
    async (input: RefType, {amount}) => {
        amount %= 26;
        if(amount < 0) amount += 26;

        if(isStringDataType(input)) {
            return input.value.replace(/[a-zA-Z]/g, (c) => String.fromCharCode(rotChar(c.charCodeAt(0), amount)));
        } else {
            return input.value.map((ch) => rotChar(ch, amount));
        }
    },
    {amount: 13},
    ({params, onChangeParams}) => {
        const handleOnChange = useCallback((e: Event) => {
            const value = (e.currentTarget as HTMLInputElement).value;
            let parsed_value: number;

            try {
                parsed_value = parseInt(value);
            } catch(e) {
                return;
            }

            onChangeParams({amount: parsed_value});
        }, [onChangeParams]);

        return <div>
            <label>Rotation Amount: <input type="number" step="1" value={params.amount} onChange={handleOnChange}/></label>
        </div>;
    },
);