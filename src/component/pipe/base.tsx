import "./base.css";

import type { ComponentType, ReactNode } from "preact/compat";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";

import { TextArea } from "@/component/common/textarea";
import { BytesView, StringView } from "@/component/data-view";
import { classNames } from "@/util";

import type { PipeProps, PipeMetadata, PipeDefinition, DataTypeName, ToRefType, PipeFunction, PipeFunctionWithParams, ToDataType } from "./type";
import { getDataTypeName, isBytesDataType, isStringDataType, normalizeData, validateValue } from "./data";

interface DisplayComponentProps<D extends DataTypeName> {
    data: ToRefType<D>;
}

function DefaultDisplayComponent<D extends DataTypeName>({data}: DisplayComponentProps<D>) {
    if(data == null) return null;
    if(isStringDataType(data)) return <StringView data={data} />;
    if(isBytesDataType(data)) return <BytesView data={data} />;
    return `${data}`;
}

export type BasePipeProps<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName>
    = PipeProps & {
    inputType: InputTypeName;
    outputType: OutputTypeName;

    pipeFunction?: PipeFunction<InputTypeName, OutputTypeName>;
    outputView?: ComponentType<{data: ToRefType<OutputTypeName>}>|null;

    className?: string;

    title?: ReactNode;
    children?: ReactNode;
};

export function BasePipe<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName>(props: BasePipeProps<InputTypeName, OutputTypeName>) {
    const {
        pipeFunction,
        outputView: OutputView = DefaultDisplayComponent,

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
    const [output_value, setOutputValue] = useState<ToRefType<OutputTypeName>|null>(null);
    const [last_error, setLastError] = useState<unknown|null>(null);

    const onOutputChangeRef = useRef(onOutputChange);

    useMemo(() => {
        if(input_value == null) return;
        if(!pipeFunction) return;

        (async () => {
            let pipe_value: ToRefType<OutputTypeName>;

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

    const handleOnTextAreaChange = useCallback((input: string) => {
        onOutputChange?.({type: 'string', value: input});
    }, [onOutputChange]);

    return <div className={classNames("sp-pipe", class_name, `sp-pipe-input-${input_value_type_name}`, `sp-pipe-output-${output_value_type_name}`)}>
        <div className="sp-pipe-header">
            { title && <div className="sp-pipe-title">{ title }</div> }
            { onClickRemove && <button title="Remove this pipe." onClick={onClickRemove}>❌</button> }
        </div>
        { input_type == 'null' && <TextArea onChange={handleOnTextAreaChange} /> }
        { children }
        { last_error != null && <div className="sp-pipe-error">{ `${last_error}` }</div> }
        { output_value != null && OutputView != null && <OutputView data={output_value} /> }
    </div>;
}

/**
 * Define a pipe.
 * @param metadata Metadata for the pipe, such as its name, description, input type, and output type.
 * @param pipeFunction The function that performs the pipe's operation.
 * @param default_params Default parameters for the pipe.
 * @param ParamsComponent Component for displaying and editing the pipe's parameters.
 * @param outputViewFactory Component for displaying the pipe's output. If not provided, a default component will be used.
 * @returns 
 */
export function definePipe<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName, ParamsType extends object>(
    metadata: PipeMetadata<InputTypeName, OutputTypeName>,
    pipeFunction: PipeFunctionWithParams<InputTypeName, OutputTypeName, ParamsType>,
    default_params: ParamsType,
    ParamsComponent?: ComponentType<{params: ParamsType, onChangeParams: (params: Partial<ParamsType>) => void}>|null,
    outputViewFactory?: ((params: ParamsType) => ComponentType<DisplayComponentProps<OutputTypeName>>)|null,
): PipeDefinition<InputTypeName, OutputTypeName> {
    return {
        ...metadata,
        Component: (props: PipeProps) => {
            const [params, setParams] = useState(default_params);

            const handleOnChangeParams = useCallback((new_params: Partial<ParamsType>) => {
                setParams((params) => ({...params, ...new_params}));
            }, [setParams]);

            const callPipeFunction = useCallback(async (input: ToRefType<InputTypeName>): Promise<ToRefType<OutputTypeName>>  => {
                if(input == null) return null as ToRefType<OutputTypeName>;

                const result = await pipeFunction(input, params);
                return normalizeData(result);
            }, [params]);

            const outputView = useMemo(() => outputViewFactory ? outputViewFactory(params) : (void 0), [outputViewFactory, params]);
            
            return <BasePipe<InputTypeName, OutputTypeName>
                title={metadata.name ?? metadata.id}

                inputType={metadata.inputType}
                outputType={metadata.outputType}

                pipeFunction={callPipeFunction}
                outputView={outputView}

                {...props}
            >
                { ParamsComponent && <div class="sp-pipe-params"><ParamsComponent params={params} onChangeParams={handleOnChangeParams} /></div> }
            </BasePipe>
        },
    };
}