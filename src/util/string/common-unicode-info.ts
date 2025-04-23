export const UNICODE_ZERO_WIDTH_NO_BREAK_SPACE = "\uFEFF";
export const UNICODE_REPLACEMENT_CHARACTER = "\uFFFD";

export const ASCII_CONTROL_NAMES = new Map<string, string>([
    "NUL", "SOH", "STX", "ETX", "EOT", "ENQ", "ACK", "BEL", "BS", "HT", "LF", "VT", "FF", "CR", "SO", "SI",
    "DLE", "DC1", "DC2", "DC3", "DC4", "NAK", "SYN", "ETB", "CAN", "EM", "SUB", "ESC", "FS", "GS", "RS", "US",
    "SP"
].map((name, i) => [String.fromCodePoint(i), name]));