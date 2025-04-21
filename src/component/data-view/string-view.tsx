import { saveFile } from "@/lib/file-io";
import "./common.css";
import "./string-view.css";

import { useCallback } from "preact/hooks";
import { StringDataType } from "../pipe";

export interface StringViewProps {
    data: StringDataType;
}

export function StringView({data}: StringViewProps) {
    const onClickSave = useCallback(async() => {
        await saveFile("output.txt", data.value, "text/plain");
    }, [data.value]);

    const onClickCopy = useCallback(async() => {
        await navigator.clipboard.writeText(data.value);
        alert("Copied to clipboard!");
    }, [data.value]);

    return <div class="sp-data-view sp-string-view">
        <div class="sp-string-view-content">{data.value}</div>
        <div class="sp-data-view-toolbar">
            <button onClick={onClickSave}>Save</button>
            <button onClick={onClickCopy}>Copy</button>
        </div>
    </div>;
}