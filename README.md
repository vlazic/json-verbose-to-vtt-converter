
# json-verbose-to-vtt-converter

This Deno project converts JSON verbose transcription files to VTT (Web Video Text Tracks) format.

## Requirements

- Deno 2 or later

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/vlazic/json-verbose-to-vtt-converter.git
   cd json-verbose-to-vtt-converter
   ```

2. Install dependencies:
   ```
   deno cache --reload main.ts
   ```

## Usage

Run the script with the following command:

```
deno run --allow-read --allow-write main.ts --input path/to/your/input.json
```

Replace `path/to/your/input.json` with the path to your JSON transcription file.

The script will generate a VTT file with the same name as the input file, but with a `.vtt` extension.

## License

This project is licensed under the MIT License.
