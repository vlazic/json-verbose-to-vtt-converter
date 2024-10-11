# json-verbose-to-vtt-converter

This Deno project converts JSON transcription files from the whisper modelto VTT (Web Video Text Tracks) format.

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
deno run --allow-read --allow-write main.ts --input path/to/your/input.json
```

Replace `path/to/your/input.json` with the path to your JSON transcription file.

### Running Remotely

You can run the script directly from GitHub without cloning the repository:

```
deno run --allow-read --allow-write https://raw.githubusercontent.com/vlazic/json-verbose-to-vtt-converter/main/main.ts --input path/to/your/input.json
```

Example output:
```
VTT content is valid.
VTT file has been created: path/to/your/input.vtt
```

Again, replace `path/to/your/input.json` with the path to your JSON transcription file.

The script will generate a VTT file with the same name as the input file, but with a `.vtt` extension.

## Project Background

This project was created out of necessity when working with the Groq API for the <https://github.com/vlazic/gozba> project. The Groq API, which uses Whisper 3 model, only provides `json` and `json_verbose` output. However, for specific needs in the project, the VTT (Web Video Text Tracks) format was required. This converter bridges that gap, allowing easy transformation from the Groq API's JSON output to the needed VTT format.

## License

This project is licensed under the MIT License.

## Keywords

Whisper 3, Groq, JSON to VTT, transcription converter, Deno
