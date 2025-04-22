import type { BytesDataType, StringDataType } from "@/component/pipe/type";

export interface EncodingMetadata<ParamsType extends object = {}> {
    id: string;
    name?: string;
    description?: string;

    default_params: ParamsType;

    encode?(params: ParamsType, data: StringDataType): Promise<BytesDataType>;
    decode?(params: ParamsType, data: BytesDataType): Promise<StringDataType>;
}