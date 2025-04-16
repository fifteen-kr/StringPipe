import "./pipeline.css";

import { PipeStringInput } from "./string-input";
import { PipeStringOutput } from "./string-output";

export function Pipeline() {
    return <div class="sp-pipeline">
        <PipeStringInput />
        <PipeStringOutput />
    </div>;
}