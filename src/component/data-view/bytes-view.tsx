import "./bytes-view.css";

import { useMemo } from "preact/hooks";

export interface BytesViewProps {
    value: Uint8Array;
}

export function BytesView({value}: BytesViewProps) {
    const hex_dumps = useMemo(() => [...value].map((byte) => byte.toString(16).padStart(2, '0')), [value]);
    return <div class="sp-bytes-view">{ hex_dumps.map((byte) => <span>{byte}</span>) }</div>;
}