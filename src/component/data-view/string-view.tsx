import { saveFile } from "@/lib/file-io";
import "./common.css";
import "./string-view.css";

import { useCallback } from "preact/hooks";

export interface StringViewProps {
    value: string;
}

export function StringView({value}: StringViewProps) {
    const onClickSave = useCallback(async() => {
        await saveFile("output.txt", value, "text/plain");
    }, [value]);

    const onClickCopy = useCallback(async() => {
        await navigator.clipboard.writeText(value);
        alert("Copied to clipboard!");
    }, [value]);

    return <div class="sp-data-view sp-string-view">
        <div class="sp-string-view-content">{value}</div>
        <div class="sp-data-view-toolbar">
            <button onClick={onClickSave}>Save</button>
            <button onClick={onClickCopy}>Copy</button>
        </div>
    </div>;
}