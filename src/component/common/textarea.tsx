import { useCallback } from "preact/hooks";

export interface TextAreaProps {
    onChange?: (value: string) => void;
}

export function TextArea(props: TextAreaProps) {
    const {
        onChange
    } = props;

    const handleOnChange = useCallback((e: Event) => {
        if(!onChange) return;

        const target = e.currentTarget;
        if(!target || !(target instanceof HTMLTextAreaElement)) return;

        onChange(target.value);
    }, [onChange]);

    return <textarea onInput={handleOnChange} />;
}