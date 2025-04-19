# StringPipe

[Try StringPipe on s.0xF.kr!](https://s.0xF.kr/)

StringPipe is a simple single-page web application for manipulating strings and bytes.

There is no need to install anything to use StringPipe, and all the data is processed locally. Just open the link above and start using it!

## Features (PLANNED)

- Hash functions (MD5, SHA-1, SHA-256, SHA-512, ...)
- Encoding/decoding (Base64, URI, ...)
- Unicode conversion (UTF-8, UTF-16, ...)
- Codes for esolangs (BrainF***, Aheui, ...)

### Type Safety

So, what makes StringPipe different from other tools?
A key feature of StringPipe is that it's designed with explicit type management in mind.

For example, SHA-256 is a function that maps bytes (of variable length) to bytes (of fixed length). StringPipe makes this explicit, and requires you to specify the encoding of the input string before hashing it.

Most other tools do not make this explicit, and may use different encodings depending on the tool used. This can lead to inconsistencies, especially when composition is involved. For example, the result of `base64(sha256("안녕!"))` may differ depending on:

- The encoding used for the input string ("안녕!") before hashing it. (UTF-8, UTF-16, CP949, ...)
- Whether the hash is uppercase or lowercase. (abcdef vs. ABCDEF)

### Various Data Source (PLANNED)

StringPipe supports multiple ways to input strings and bytes:

- Textbox (the most natural, but often inaccurate way).
- Contents from a file. (StringPipe never uploads your file to any server - it's all done locally in your browser.)
- Contents from the clipboard.
- List of decimal, binary, or hexadecimal representations of integers.

Be aware that, currently StringPipe is not intended to be used for large files.
