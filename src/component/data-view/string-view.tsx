import "./string-view.css";

export interface StringViewProps {
    value: string;
}

export function StringView({value}: StringViewProps) {
    return <div class="sp-string-view">{value}</div>;
}