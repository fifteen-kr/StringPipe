import type {ReactNode} from "preact/compat";

import {Args} from "./args";

import {classNames} from "@/util";

export interface BasePipeProps {
    className?: string;
    title?: string;
    children?: ReactNode;
}

export function BasePipe({className, title, children}: BasePipeProps) {
    return <div className={classNames("sp-pipe", className)}>
        { title && <div className="sp-pipe-title">{title}</div> }
        <Args />
        {children}
    </div>;
}