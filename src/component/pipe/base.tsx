import type { ReactNode } from "preact/compat";
import { useCallback, useMemo, useState } from "preact/hooks";

import { AsDataTypeDefinition, DataType } from "@/pipe";
import { TextArea } from "@/component/common/textarea";
import { classNames } from "@/util";

import type { PipeProps } from "./type";

type WithPipeFunction<InputType extends DataType|null, OutputType extends DataType> = InputType extends DataType ? {
    pipeFunction: (input: InputType) => Promise<OutputType>;
} : {
    pipeFunction?: never;
};

type WithPipeProps<InputType extends DataType|null, OutputType extends DataType> = InputType extends DataType ? PipeProps<InputType, OutputType> : {
    inputValue?: never;
    onOutputChange?: (output: OutputType) => void;
};

export type BasePipeProps<InputType extends DataType|null, OutputType extends DataType>
    = WithPipeFunction<InputType, OutputType> & WithPipeProps<InputType, OutputType> & {
    inputType: InputType extends DataType ? AsDataTypeDefinition<InputType> : 'null';
    outputType: AsDataTypeDefinition<OutputType>;

    className?: string;

    title?: ReactNode;
    children?: ReactNode;
};

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
        (pipeFunction as (input: InputType) => Promise<OutputType>)(input_value as InputType).then((pipe_value) => {
            setOutputValue(pipe_value);
        });
    }, [setOutputValue, pipeFunction, input_value]);

    return <div className={classNames("sp-pipe", class_name)}>
        { title && <div className="sp-pipe-title">{ title }</div> }
        { input_type == 'null' && <TextArea onChange={onOutputChange as (input: string) => void} /> }
        { children }
        { input_type != 'null' && output_value }
    </div>;
}