import "./catalog.css";

import { classNames } from "@/util";
import type { DataType, PipeMetadata } from "../type";

export interface PipeCatalogProps {
    entries: PipeMetadata<DataType|null, DataType>[];

    onSelect?: (id: string) => void;
}

export function PipeCatalog(props: PipeCatalogProps) {
    const {
        entries,
        onSelect,
    } = props;

    return <div class="sp-pipe-catalog">
        { entries.map(entry => <PipeCatalogItem
            key={entry.id}
            entry={entry}
            onClick={() => onSelect?.(entry.id)}
        />) }
    </div>;
}

export interface PipeCatalogItemProps<InputType extends DataType|null, OutputType extends DataType> {
    entry: PipeMetadata<InputType, OutputType>;

    onClick?: () => void;
}

export function PipeCatalogItem({entry, onClick}: PipeCatalogItemProps<DataType|null, DataType>) {
    return <div class={classNames("sp-pipe-catalog-item")} onClick={onClick}>
        {entry.name ?? entry.id}
    </div>
}