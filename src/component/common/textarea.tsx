import { useCallback } from "preact/hooks";

export interface TextAreaProps {
    onChange?: (value: string) => void;
}

export function TextArea(props: TextAreaProps) {
    const {
        onChange
    } = props;

    const handleOnChange = useCallback((e: Event) => {
        onChange?.((e.currentTarget as HTMLTextAreaElement).value);
    }, [onChange]);

    return <textarea aria-label="Input" onInput={handleOnChange} rows={4} />;
}