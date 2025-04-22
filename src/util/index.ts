/**
 * Join classnames together, ignoring falsey values.
 * 
 * @param args List of classnames, or falsey values to ignore.
 * @returns Joined classnames.
 */
export function classNames(...args: Array<string|null|undefined|false|0>): string {
    return args.filter((s) => !!s).join(' ');
}

export function escapeRegExpLiteral(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ESCAPED_CONFUSING_CHARACTERS = new Map<string, string>([
    ["\x00", "<NUL (U+0000)>"],
    ["\u0007", "<BEL (U+0007)>"],
    ["\b", "<BS (U+0008)>"],
    ["\t", "<TAB (U+0009)>"],
    ["\n", "<LF (U+000A)>"],
    ["\v", "<VT (U+000B)>"],
    ["\f", "<FF (U+000C)>"],
    ["\r", "<CR (U+000D)>"],
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

export const uuidv4 = crypto.randomUUID.bind(crypto);