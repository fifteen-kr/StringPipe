# StringPipe

StringPipe is a simple single-page web application for manipulating strings and bytes, with emphasis on explicit type management.

## Philosophy

There are many tools available online for manipulating strings and bytes, such as hashing, encoding, and decoding. However, they are often not designed with explicit type management in mind.

This may cause inconsistencies. For example, SHA-256 hashes of a string may differ depending on the tool used, because they may use different encodings. The problem worsens when composition is involved. For example, the result of `base64(sha256("hello"))` may differ depending on whether the hash is uppercase or lowercase.

The fundamental reason for the inconsistencies is that SHA-256 (and many other hash/key derivation functions) *not* being a function mapping strings to strings; it maps bytes (of variable length) to bytes (of fixed length). There are implicit conversions between strings and bytes, which are configurable and need to be made explicit.

StringPipe is designed to make those conversions explicit, and to provide a consistent and reliable way to manipulate strings and bytes.

## Types

### String

A string is a sequence of nonnegative integers ranging between 0 and 0x10FFFF, or in other words, a sequence of [Unicode code points](https://www.unicode.org/glossary/#code_point), often referred as "runes".

In StringPipe, string I/O may happen in a few ways:

- Textbox (the most natural, but often inaccurate way).
- List of decimal, binary, or hexadecimal representations of integers.
- A string literal.

### Bytes

Bytes consist of nonnegative integers ranging between 0 and 255.

In StringPipe, byte I/O may happen in a few ways:

- With HexView
- List of decimal, binary, or hexadecimal representations of integers
- Python, C or BrainF**k representation of bytes

By default, conversion between strings and bytes is done using UTF-8.