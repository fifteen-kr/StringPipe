import {BasePipe} from "./base";

export interface PipeStringOutputProps {
    value: string;
}

export function PipeStringOutput() {
    return <BasePipe className="sp-pipe-output" title="String Output">
        Test Output
    </BasePipe>;
}