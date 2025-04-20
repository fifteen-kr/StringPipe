import "./catalog.css";

import { classNames } from "@/util";
import type { DataType, PipeMetadata, PipeCategory, DataTypeName } from "../type";

export interface PipeCatalogProps {
    categories: PipeCategory[];

    onSelect?: (id: string) => void;
}

export function PipeCatalog(props: PipeCatalogProps) {
    const {
        categories,
        onSelect,
    } = props;

    return <div class="sp-pipe-catalog">
        <p class="sp-pipe-catalog-instruction">Choose a pipe to insert!</p>
        <div class="sp-pipe-catalog-categories">
            { categories.map(category => <PipeCatalogCategory key={category.id} category={category} onSelect={onSelect} />) }
        </div>
    </div>;
}

export interface PipeCatalogCategoryProps {
    category: PipeCategory;
    onSelect?: (id: string) => void;
}

export function PipeCatalogCategory({category, onSelect}: PipeCatalogCategoryProps) {
    return <div class={classNames("sp-pipe-catalog-category")}>
        <div class="sp-pipe-catalog-category-name">{category.name ?? category.id}</div>
        <div class="sp-pipe-catalog-category-items">
            { category.entries.map(entry => <PipeCatalogItem key={entry.id} entry={entry} onClick={() => onSelect?.(entry.id)} />) }
        </div>
    </div>
}

export interface PipeCatalogItemProps<InputTypeName extends DataTypeName, OutputTypeName extends DataTypeName> {
    entry: PipeMetadata<InputTypeName, OutputTypeName>;

    onClick?: () => void;
}

export function PipeCatalogItem({entry, onClick}: PipeCatalogItemProps<DataTypeName, DataTypeName>) {
    return <div class={classNames("sp-pipe-catalog-item")} title={entry.description} onClick={onClick}>
        {entry.name ?? entry.id}
    </div>
}