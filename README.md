# StringPipe

StringPipe is a simple single-page webapp for manipulating strings and bytes, with emphasis on explicit type management.

## Explicit Type Management

Often, many different tools easily available online would give different results for common tasks, such as computing SHA-256 hashes of a string.
The most common reason is that they don't agree on which encoding scheme to use; UTF-8 is most common but some may use UTF-16LE or a system codepage that's not based on Unicode.
When composition is provided, the problem becomes worse; often they feed lowercase hexadecimal representation of digest, but sometimes they feed uppercase or binary representations of it.

Fundamentally, this is caused by SHA-256 (and many other hash/key derivation functions) *not* being a function mapping strings to strings; it maps bytes (of variable length) to bytes (of fixed length).
It's just that, intermediate steps of converting string to bytes (encoding) and bytes to string (hexdump) are being neglected.
However, there can be several choices on how those conversions are being made, and the results can differ drastically depending on how the conversions are being made.

In StringPipe, strings and bytes are clearly distinguished. While conversions between them may happen automatically, such conversions are always noticeable and configurable, results in consistent and reliable computations.

### String

A string is a sequence of nonnegative integers ranging between 0 and 0x10FFFF. In other words, a string is a sequence of [Unicode code points](https://www.unicode.org/glossary/#code_point), often referred as "runes".

In StringPipe, string I/O may happen in a few ways:
- Textbox (the most natural, but often inaccurate way)
- List of decimal, binary, or hexadecimal representations of integers
- A string literal

### Bytes

Bytes, obviously, consist of nonnegative integers ranging between 0 and 255.

In StringPipe, byte I/O may happen in a few ways:
- With HexView
- List of decimal, binary, or hexadecimal representations of integers
- Python, C or BrainF**k representation of bytes
