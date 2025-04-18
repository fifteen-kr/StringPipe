import type { ReactNode } from "preact/compat";
import { useCallback, useMemo, useState } from "preact/hooks";

import { TextArea } from "@/component/common/textarea";
import { classNames } from "@/util";

import type { DataType, AsDataTypeDefinition, PipeProps } from "./type";

type WithPipeFunction<InputType extends DataType|null, OutputType extends DataType> = InputType extends DataType ? {
    pipeFunction: (input: InputType) => Promise<OutputType>;
} : {
    pipeFunction?: never;
};

export type BasePipeProps<InputType extends DataType|null, OutputType extends DataType>
    = WithPipeFunction<InputType, OutputType> & PipeProps & {
    inputType: AsDataTypeDefinition<InputType>;
    outputType: AsDataTypeDefinition<OutputType>;

    className?: string;

    title?: ReactNode;
    children?: ReactNode;
};

function validateValue<D extends DataType|null>(data_type: AsDataTypeDefinition<D>, value: unknown): value is D {
    switch(data_type) {
        case "string": return typeof value === "string";
        case "bytes": return value instanceof Uint8Array;
        case "null": return value == null;
        default: return false;
    }
}

export function BasePipe<InputType extends DataType|null, OutputType extends DataType>(props: BasePipeProps<InputType, OutputType>) {
    const {
        pipeFunction,
        onOutputChange,

        inputValue: input_value,

        inputType: input_type,
        outputType: output_type,

        className: class_name,

        title,
        children,
    } = props;

    const [override_input, setOverrideInput] = useState(false);
    const [output_value, setOutputValue] = useState<OutputType|null>(null);

    useMemo(() => {
        if(input_value == null) return;
        if(!pipeFunction) return;

        const typeFixedPipeFunction = pipeFunction as (input: InputType) => Promise<OutputType>;

        (async () => {
            let pipe_value: OutputType;

            try {
                if(!validateValue(input_type, input_value)) {
                    throw new Error(`Invalid input value type '${typeof input_value}' for input type '${input_type}'.`);
                }

                pipe_value = await typeFixedPipeFunction(input_value as InputType);
            } catch(e) {
                console.error(e);
                return;
            }

            setOutputValue(pipe_value);
        })();
    }, [setOutputValue, pipeFunction, input_type, input_value]);

    return <div className={classNames("sp-pipe", class_name)}>
        { title && <div className="sp-pipe-title">{ title }</div> }
        { input_type == 'null' && <TextArea onChange={onOutputChange as ((input: string) => void | undefined)} /> }
        { children }
        { input_type != 'null' && output_value }
    </div>;
}