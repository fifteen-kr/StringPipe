import {BasePipe} from "./base";

export interface StringInputPipeProps {
    onOutputChange?: (output: string) => void;
}

export function StringInputPipe({onOutputChange}: StringInputPipeProps) {
    return <BasePipe
        title="String Input"
        className="sp-pipe-input"
        
        inputType="null"
        outputType="string"

        onOutputChange={onOutputChange}
    >
    </BasePipe>;
}