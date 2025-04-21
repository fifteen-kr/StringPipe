import "./common.css";
import "./bytes-view.css";

import { useCallback, useMemo } from "preact/hooks";
import { saveFile } from "@/lib/file-io";
import { BytesDataType } from "../pipe";

export interface BytesViewProps {
    data: BytesDataType;
}

export function BytesView({data}: BytesViewProps) {
    const hex_dumps = useMemo(() => [...data.value].map((byte) => byte.toString(16).padStart(2, '0')), [data.value]);

    const onClickSave = useCallback(async () => {
        await saveFile("output.bin", new Blob([data.value], {type: "application/octet-stream"}));
    }, [data.value]);

    return <div class="sp-data-view sp-bytes-view">
        <div class="sp-bytes-view-content">{ hex_dumps.map((byte) => <span>{byte}</span>) }</div>
        <div class="sp-data-view-toolbar">
            <button onClick={onClickSave}>Save</button>
        </div>
    </div>;
}