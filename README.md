# json-verbose-to-vtt-converter

This Deno project converts JSON transcription files from the whisper model to VTT (Web Video Text Tracks) format. It also provides validation for both JSON and VTT files.

## Requirements

- Deno 2 or later

## Installation

### Installing Deno

#### For macOS and Linux:

```
curl -fsSL https://deno.land/install.sh | sh
```

#### For Windows (using PowerShell):

```
irm https://deno.land/install.ps1 | iex
```

### Project Setup

You don't need to install anything else if you're running the script remotely. If you want to run it locally:

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

### Running Locally

If you've cloned the repository, run the script with the following command:

```
deno run --allow-read --allow-write main.ts [OPTIONS]
```

### Running Remotely

You can run the script directly from GitHub without cloning the repository:

```
deno run --allow-read --allow-write https://raw.githubusercontent.com/vlazic/json-verbose-to-vtt-converter/main/main.ts [OPTIONS]
```

### Options

- `-i, --input <file>`: Specify the input file (JSON or VTT) (required)
- `-v, --validate`: Validate the input file without conversion
- `-s, --silent`: Suppress all console output
- `-h, --help`: Show the help message

### Examples

1. Convert a JSON file to VTT:
   ```
   deno run --allow-read --allow-write main.ts -i path/to/your/input.json
   ```

2. Validate a JSON file without creating a VTT file:
   ```
   deno run --allow-read --allow-write main.ts -i path/to/your/input.json --validate
   ```

3. Validate a VTT file:
   ```
   deno run --allow-read --allow-write main.ts -i path/to/your/input.vtt --validate
   ```

4. Run silently (suppress all console output):
   ```
   deno run --allow-read --allow-write main.ts -i path/to/your/input.json --silent
   ```

### Exit Codes

- `0`: Successful execution (conversion or validation)
- `1`: Error occurred (e.g., invalid input, validation failed)

## Project Background

This project was created out of necessity when working with the Groq API for the <https://github.com/vlazic/gozba> project. The Groq API, which uses Whisper 3 model, only provides `json` and `json_verbose` output. However, for specific needs in the project, the VTT (Web Video Text Tracks) format was required. This converter bridges that gap, allowing easy transformation from the Groq API's JSON output to the needed VTT format.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Keywords

Whisper 3, Groq, JSON to VTT, transcription converter, Deno, validation, silent mode, VTT validation, JSON validation
