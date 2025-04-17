import type { ReactElement } from "preact/compat";

import type { DataType } from "@/pipe";

export interface PipeProps<InputType extends DataType, OutputType extends DataType> {
    inputValue: InputType;
    onOutputChange?: (output: OutputType) => void;
}

export type PipeComponent<InputType extends DataType, OutputType extends DataType> = (props: PipeProps<InputType, OutputType>) => ReactElement;