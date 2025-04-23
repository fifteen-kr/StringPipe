import { BytesDataType, StringDataType } from "@/component/pipe/type";

export type UntranslatableStrategy
    = "error" // Throw an error if an untranslatable character is encountered.
    | "ignore" // Silently ignore untranslatable characters.
    | "replace" // Replace untranslatable characters with U+FFFD.
    ;

export interface BaseEncodingParams {}

export interface BaseDecodingParams {
    on_untranslatable: UntranslatableStrategy;
}

export interface EncodingMetadata {
    id: string;
    name?: string;
    description?: string;
}

export interface EncodingEncodeDefinition<EncodingParams extends BaseEncodingParams = BaseEncodingParams> {
    encode(str: StringDataType, params: EncodingParams): Promise<BytesDataType>;
}

export interface EncodingDecodeDefinition<DecodingParams extends BaseDecodingParams = BaseDecodingParams> {
    decode(bytes: BytesDataType, params: DecodingParams): Promise<StringDataType>;
}

export type EncodingDefinition<EncodingParams extends BaseEncodingParams = BaseEncodingParams, DecodingParams extends BaseDecodingParams = BaseDecodingParams>
    = EncodingMetadata & EncodingEncodeDefinition<EncodingParams> & EncodingDecodeDefinition<DecodingParams>;