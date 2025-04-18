import "./catalog.css";

import { classNames } from "@/util";
import type { DataType, PipeMetadata } from "../type";

export interface PipeCatalogProps {
    entries: PipeMetadata<DataType|null, DataType>[];

    selectedEntryId?: string|null;
    onSelect?: (id: string) => void;
}

export function PipeCatalog(props: PipeCatalogProps) {
    const {
        entries,
        selectedEntryId: selected_entry_id,
        onSelect,
    } = props;

    return <div class="sp-pipe-catalog">
        <p>Select Pipe to Add</p>
        { entries.map(entry => <PipeCatalogItem
            key={entry.id}
            entry={entry}
            selected={entry.id === selected_entry_id}
            onClick={() => onSelect?.(entry.id)}
        />) }
    </div>;
}

export interface PipeCatalogItemProps<InputType extends DataType|null, OutputType extends DataType> {
    entry: PipeMetadata<InputType, OutputType>;
    selected?: boolean;

    onClick?: () => void;
}

export function PipeCatalogItem({entry, selected, onClick}: PipeCatalogItemProps<DataType|null, DataType>) {
    return <div class={classNames("sp-pipe-catalog-item", selected && "sp-selected")} onClick={onClick}>
        {entry.name ?? entry.id}
    </div>
}