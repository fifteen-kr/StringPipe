import "./base.css";

import type { ComponentType, ReactNode } from "preact/compat";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";

import { TextArea } from "@/component/common/textarea";
import { BytesView, StringView } from "@/component/data-view";
import { classNames } from "@/util";

import type { PipeProps, PipeMetadata, PipeDefinition, DataTypeName, ToDataType, PipeFunction, PipeFunctionWithParams, DataType } from "./type";
import { getDataTypeName, validateValue } from "./data";

export type BasePipeProps<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName>
    = PipeProps & {
    inputType: InputTypeName;
    outputType: OutputTypeName;

    pipeFunction?: PipeFunction<InputTypeName, OutputTypeName>;

    className?: string;

    title?: ReactNode;
    children?: ReactNode;
};

export function BasePipe<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName>(props: BasePipeProps<InputTypeName, OutputTypeName>) {
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
    const [output_value, setOutputValue] = useState<ToDataType<OutputTypeName>|null>(null);
    const [last_error, setLastError] = useState<unknown|null>(null);

    const onOutputChangeRef = useRef(onOutputChange);

    useMemo(() => {
        if(input_value == null) return;
        if(!pipeFunction) return;

        (async () => {
            let pipe_value: ToDataType<OutputTypeName>;

            try {
                if(!validateValue(input_type, input_value)) {
                    throw new Error(`Invalid input value type '${typeof input_value}' for input type '${input_type}'.`);
                }

                pipe_value = await pipeFunction(input_value);
                if(pipe_value == null) {
                    throw new Error(`The function returned null.`);
                }
            } catch(e) {
                setLastError(e);
                return;
            }

            setLastError(null);
            setOutputValue(pipe_value);
            
            onOutputChangeRef.current?.(pipe_value);
        })();
    }, [pipeFunction, input_type, input_value]);

    const input_value_type_name = getDataTypeName(input_value, input_type);
    const output_value_type_name = getDataTypeName(output_value, output_type);

    return <div className={classNames("sp-pipe", class_name, `sp-pipe-input-${input_value_type_name}`, `sp-pipe-output-${output_value_type_name}`)}>
        <div className="sp-pipe-header">
            { title && <div className="sp-pipe-title">{ title }</div> }
            { onClickRemove && <button title="Remove this pipe." onClick={onClickRemove}>❌</button> }
        </div>
        { input_type == 'null' && <TextArea onChange={onOutputChange as ((input: string) => void | undefined)} /> }
        { children }
        { last_error != null && <div className="sp-pipe-error">{ `${last_error}` }</div> }
        { typeof output_value === 'string' && <StringView value={output_value} /> }
        { output_value instanceof Uint8Array && <BytesView value={output_value} />  }
    </div>;
}

export function definePipe<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName, ParamsType extends object>(
    metadata: PipeMetadata<InputTypeName, OutputTypeName>,
    pipeFunction: PipeFunctionWithParams<InputTypeName, OutputTypeName, ParamsType>,
    default_params: ParamsType,
    ParamsComponent?: ComponentType<{params: ParamsType, onChangeParams: (params: Partial<ParamsType>) => void}>,
): PipeDefinition<InputTypeName, OutputTypeName> {
    return {
        ...metadata,
        Component: (props: PipeProps) => {
            const [params, setParams] = useState(default_params);

            const handleOnChangeParams = useCallback((new_params: Partial<ParamsType>) => {
                setParams((params) => ({...params, ...new_params}));
            }, [setParams]);

            const callPipeFunction = useCallback(async (input: ToDataType<InputTypeName>): Promise<ToDataType<OutputTypeName>>  => {
                return await pipeFunction(input, params);
            }, [params]);
            
            return <BasePipe<InputTypeName, OutputTypeName>
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