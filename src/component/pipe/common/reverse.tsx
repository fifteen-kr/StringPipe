import { BasePipe } from "../base";
import { PipeComponent } from "../type";

function reverseString(input: string): Promise<string> {
    return Promise.resolve([...input].reverse().join(""));
}

export const ReverseStringPipe: PipeComponent = (props) => {
    return <BasePipe
        title="Reverse String"

        inputType="string"
        outputType="string"

        pipeFunction={reverseString}
        {...props}
    ></BasePipe>;
};