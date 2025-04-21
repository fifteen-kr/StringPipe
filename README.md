# StringPipe

![Build Status](https://github.com/fifteen-kr/StringPipe/actions/workflows/build.yaml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

[Try StringPipe on s.0xF.kr!](https://s.0xF.kr/)

**StringPipe** is a zero-install, web-based playground for converting, analyzing, and hashing texts and bytes.

For example, you can compose a pipeline like `Input → UTF-8 → SHA-256 → Base64` and use it to hash a string.

(Note: StringPipe is still in development. Some features (such as hash functions) may not have been implemented yet.)

## Features

- Mobile-friendly UI
- Runs locally in your browser (no server-side computation)
- Explicit type management (avoids inconsistencies cause by implicit encoding/decoding)

### Pipes

- Miscellaneous
  - Word/Line Count
- Encoding
  - UTF-8
  - Base64
- Literal
  - Integer List
  - Python String Literal
- Cipher
  - ROT (including ROT13)

## Development

### Setup

Install the following:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

Then, install dependencies:

```sh
pnpm install
```

### Debug

```sh
pnpm debug
```

This will start a development server at `http://localhost:8000/`.

- `http://localhost:8000/debug`: hot-reloadable debug build
- `http://localhost:8000/`: does not hot-reload

### Build

```sh
pnpm build
```

Output files will be placed in the `/serve` directory.
For deploying, you may want to exclude `/server/debug` from the directory, although it is not strictly necessary.

You may use any static file server to serve the files, such as GitHub Pages.

## Planned Features

### Pipes

- Miscellaneous
  - n-gram Frequency Analysis
  - Unicode Lookup (code point, name, ...)
  - Unicode Normalization
  - Regex Search/Replace
- Encoding
  - Unicode Encodings (UTF-16, UTF-32, ...)
  - Various Text Encodings (EUC-KR, Shift-JIS, ...)
  - URI Encodings (URI, URI Component)
  - Punycode
- Hash
  - MD5, SHA-1, SHA-256, SHA-512, ...
- Literal
  - HTML Entity
  - Esoteric Languages (BrainF***, Aheui, ...)
- Cipher
  - Classic Ciphers (Caesar, Vigenère, ...)
  - Modern Ciphers (AES, ...)

### Various Data Source

StringPipe will support multiple ways to input strings and bytes:

- Textbox (the most natural, but often inaccurate way).
- Contents from a file. (StringPipe never uploads your file to any server - it's all done locally in your browser.)
- Contents from the clipboard.
- List of decimal, binary, or hexadecimal representations of integers.

Be aware that StringPipe will not be intended to be used for large files.
