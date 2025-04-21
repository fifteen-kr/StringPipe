import "./common.css";
import "./bytes-view.css";

import { useCallback, useMemo } from "preact/hooks";
import { saveFile } from "@/lib/file-io";

export interface BytesViewProps {
    value: Uint8Array;
}

export function BytesView({value}: BytesViewProps) {
    const hex_dumps = useMemo(() => [...value].map((byte) => byte.toString(16).padStart(2, '0')), [value]);

    const onClickSave = useCallback(async () => {
        await saveFile("output.bin", new Blob([value], {type: "application/octet-stream"}));
    }, [value]);

    return <div class="sp-data-view sp-bytes-view">
        <div class="sp-bytes-view-content">{ hex_dumps.map((byte) => <span>{byte}</span>) }</div>
        <div class="sp-data-view-toolbar">
            <button onClick={onClickSave}>Save</button>
        </div>
    </div>;
}