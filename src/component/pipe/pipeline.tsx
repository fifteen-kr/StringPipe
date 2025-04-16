import "./pipeline.css";

import { useState } from "preact/hooks";

import { PipeStringInput } from "./string-input";
import { PipeStringOutput } from "./string-output";

export function Pipeline() {
    // TODO
    const [pipeline, setPipeline] = useState<unknown[]>([123]);

    return <div class="sp-pipeline">
        <PipeStringInput />
        { pipeline.map((_, i) => {
            return <div key={i}>TODO</div>;
        }) }
        <PipeStringOutput />
    </div>;
}