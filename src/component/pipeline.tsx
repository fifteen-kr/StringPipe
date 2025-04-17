import "./pipeline.css";

import "./pipe";

import type { ReactNode } from "preact/compat";
import { useState } from "preact/hooks";

import { StringInputPipe } from "./pipe/string-input";
import { ReverseStringPipe } from "./pipe";

export function Pipeline() {
    const [input, setInput] = useState("");

    return <div class="sp-pipeline">
        <StringInputPipe onOutputChange={setInput} />
        <ReverseStringPipe inputValue={input} />
    </div>;
}