export * from "./string";

/**
 * Join classnames together, ignoring falsey values.
 * 
 * @param args List of classnames, or falsey values to ignore.
 * @returns Joined classnames.
 */
export function classNames(...args: Array<string|null|undefined|false|0>): string {
    return args.filter((s) => !!s).join(' ');
}

export const uuidv4 = crypto.randomUUID.bind(crypto);