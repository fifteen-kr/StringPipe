import type { BytesRef, RefType } from "../type";
import { definePipe } from "../base";
import { useId } from "preact/hooks";

interface ChangeEndianParams {
    word_size: 2|4|8;
}

export const ChangeEndianPipe = definePipe<'bytes', 'bytes', ChangeEndianParams>(
    {
        id: "change-endian",
        name: "Change Endianness",
        description: "Change the endianness of the input.",

        inputType: 'bytes',
        outputType: 'bytes',
    },
    async (data: BytesRef, {word_size}: ChangeEndianParams) => {
        const bytes = data.value;
        const output_length = bytes.length % word_size === 0 ? bytes.length : bytes.length + word_size - (bytes.length % word_size);
        const result = new Uint8Array(output_length);

        for (let i = 0; i < bytes.length; i += word_size) {
            for (let j = 0; j < word_size; j++) {
                const orig_ind = i+j;
                if(orig_ind >= bytes.length) break;
                
                const new_ind = i + word_size - 1 - j;
                result[new_ind] = bytes[orig_ind];
            }
        }

        return result;
    },
    {
        word_size: 4,
    },
    ({params, onChangeParams}) => {
        const word_size_id = useId();

        return <div className="sp-pipe-params-row">
            <span>Word size:</span>
            <label><input type="radio" name={word_size_id} checked={params.word_size === 2} onChange={() => onChangeParams({word_size: 2})} /> 2</label>
            <label><input type="radio" name={word_size_id} checked={params.word_size === 4} onChange={() => onChangeParams({word_size: 4})} /> 4</label>
            <label><input type="radio" name={word_size_id} checked={params.word_size === 8} onChange={() => onChangeParams({word_size: 8})} /> 8</label>
        </div>;
    },
);