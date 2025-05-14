export * from "./common-unicode-info";

import { ASCII_CONTROL_NAMES } from "./common-unicode-info";

export function escapeRegExpLiteral(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ESCAPED_CONFUSING_CHARACTERS = new Map<string, string>([
    [" ", "<space (U+0020)>"],
    ["\"", "<double-quote (U+0022)>"],
    ["'", "<single-quote (U+0027)>"],
    ["<", "<less-than (U+003C)>"],
    [">", "<greater-than (U+003E)>"],
    ["\\", "<backslash (U+005C)>"],
    ["`", "<backtick (U+0060)>"],
]);

/**
 * Escapes non-ASCII characters or confusing characters in a string.
 * @param s String to escape.
 * @returns Confusing characters escaped as <U+XXXX>; XXXX is the Unicode code point in hexadecimal; could be up to 6 characters long.
 */
export function escapeConfusingCharacters(s: string): string {
    let result = "";

    for(const char of s) {
        const ascii_name = ASCII_CONTROL_NAMES.get(char);
        if(ascii_name != null) {
            result += `<${ascii_name} (U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')})>`;
            continue;
        }

        const escaped = ESCAPED_CONFUSING_CHARACTERS.get(char);
        if(escaped != null) {
            result += escaped;
            continue;
        }

        const code = char.codePointAt(0)!;
        if(code < 32 || code >= 128) {
            result += `<U+${code.toString(16).toUpperCase().padStart(4, '0')}>`;
        } else {
            result += char;
        }
    }

    return result;
}