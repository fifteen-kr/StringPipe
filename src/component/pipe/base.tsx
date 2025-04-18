import "./base.css";

import type { ComponentType, ReactNode } from "preact/compat";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";

import { TextArea } from "@/component/common/textarea";
import { BytesView, StringView } from "@/component/data-view";
import { classNames } from "@/util";

import type { DataType, AsDataTypeDefinition, PipeProps, PipeMetadata, PipeDefinition, PipeComponentType } from "./type";

export type BasePipeProps<InputType extends DataType|null, OutputType extends DataType>
    = PipeProps & {
    inputType: AsDataTypeDefinition<InputType>;
    outputType: AsDataTypeDefinition<OutputType>;

    pipeFunction?: (input: InputType) => Promise<OutputType>;

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

        onClickRemove,
    } = props;

    const [override_input, setOverrideInput] = useState(false);
    const [output_value, setOutputValue] = useState<OutputType|null>(null);
    const [last_error, setLastError] = useState<unknown|null>(null);

    const onOutputChangeRef = useRef(onOutputChange);

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
                setLastError(e);
                return;
            }

            setLastError(null);
            setOutputValue(pipe_value);
            
            onOutputChangeRef.current?.(pipe_value);
        })();
    }, [pipeFunction, input_type, input_value]);

    return <div className={classNames("sp-pipe", class_name, `sp-pipe-input-${input_type}`, `sp-pipe-output-${output_type}`)}>
        <div className="sp-pipe-header">
            { title && <div className="sp-pipe-title">{ title }</div> }
            { onClickRemove && <button title="Remove this pipe." onClick={onClickRemove}>X</button> }
        </div>
        { input_type == 'null' && <TextArea onChange={onOutputChange as ((input: string) => void | undefined)} /> }
        { children }
        { last_error != null && <div className="sp-pipe-error">{ `${last_error}` }</div> }
        { typeof output_value === 'string' && <StringView value={output_value} /> }
        { output_value instanceof Uint8Array && <BytesView value={output_value} />  }
    </div>;
}

export function definePipe<InputType extends DataType|null, OutputType extends DataType, ParamsType extends Record<string, unknown>>(
    metadata: PipeMetadata<InputType, OutputType>,
    pipeFunction: (input: InputType, params: ParamsType) => Promise<OutputType>,
    default_params: ParamsType,
    ParamsComponent?: ComponentType<{params: ParamsType, onChangeParams: (params: Partial<ParamsType>) => void}>,
): PipeDefinition<InputType, OutputType> {
    return {
        ...metadata,
        Component: (props: PipeProps) => {
            const [params, setParams] = useState(default_params);

            const handleOnChangeParams = useCallback((new_params: Partial<ParamsType>) => {
                setParams((params) => ({...params, ...new_params}));
            }, [setParams]);

            const callPipeFunction = useCallback(async (input: InputType): Promise<OutputType>  => {
                return await pipeFunction(input, params);
            }, [params]);
            
            return <BasePipe<InputType, OutputType>
                title={metadata.name ?? metadata.id}

                inputType={metadata.inputType}
                outputType={metadata.outputType}

                pipeFunction={callPipeFunction}
                {...props}
            >
                { ParamsComponent && <div class="sp-pipe-args"><ParamsComponent params={params} onChangeParams={handleOnChangeParams} /></div> }
            </BasePipe>
        },
    };
}