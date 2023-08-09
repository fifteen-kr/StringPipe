# StringPipe

StringPipe is a simple single-page webapp for manipulating strings and bytes, with emphasis on explicit type conversions.

## Explicit Type Conversion

Often, many different tools easily available online would give different results for common tasks, such as computing SHA-256 hashes of a string.
The most common reason is that they don't agree on which encoding scheme to use; UTF-8 is most common but some may use UTF-16LE or a system codepage that's not based on Unicode.
When composition is provided, the problem becomes worse; often they feed lowercase hexadecimal representation of digest, but sometimes they feed uppercase or binary representations of it.

Fundamentally, this is caused by SHA-256 (and many other hash/key derivation functions) *not* being a function mapping strings to strings; it maps bytes (of variable length) to bytes (of fixed length).
