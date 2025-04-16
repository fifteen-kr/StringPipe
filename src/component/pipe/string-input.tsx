import {BasePipe} from "./base";

export interface PipeStringInputProps {
    onChange: (value: string) => void;
}

export function PipeStringInput() {
    return <BasePipe className="sp-pipe-input" title="String Input">
        Test Input
    </BasePipe>;
}