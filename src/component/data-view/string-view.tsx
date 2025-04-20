import { useCallback } from "preact/hooks";
import "./string-view.css";

export interface StringViewProps {
    value: string;
}

export function StringView({value}: StringViewProps) {
    const onClickCopy = useCallback(async() => {
        await navigator.clipboard.writeText(value);
        alert("Copied to clipboard!");
    }, [value]);

    return <div class="sp-string-view">{value}<button class="sp-string-view-copy" onClick={onClickCopy}>Copy</button></div>;
}