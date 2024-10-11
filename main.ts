import { parseArgs } from "jsr:@std/cli@1.0.6/parse-args";
import { WebVTTParser, WebVTTSerializer } from "npm:webvtt-parser-esm";

// Types
interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
}

interface TranscriptionResponse {
  task: string;
  language: string;
  duration: number;
  text: string;
  segments: Segment[];
}

// Utils
function formatTime(seconds: number): string {
  const pad = (num: number): string => num.toString().padStart(2, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${ms.toString().padStart(3, '0')}`;
}

// Converter
function jsonToVTT(json: TranscriptionResponse): string {
  let vtt = "WEBVTT\n\n";
  json.segments.forEach((segment) => {
    vtt += `${formatTime(segment.start)} --> ${formatTime(segment.end)}\n`;
    vtt += `${segment.text.trim()}\n\n`;
  });
  return vtt;
}

// Validators and Serializer
function validateAndSerializeVTT(vttContent: string): { isValid: boolean; serializedVtt: string } {
  const parser = new WebVTTParser();
  const parsedVtt = parser.parse(vttContent);
  const serializer = new WebVTTSerializer();
  const serializedVtt = serializer.serialize(parsedVtt.cues);
  return { isValid: parsedVtt.errors.length === 0, serializedVtt };
}

function validateJSON(jsonContent: string): boolean {
  try {
    const parsed = JSON.parse(jsonContent) as TranscriptionResponse;
    return (
      typeof parsed.task === 'string' &&
      typeof parsed.language === 'string' &&
      typeof parsed.duration === 'number' &&
      typeof parsed.text === 'string' &&
      Array.isArray(parsed.segments) &&
      parsed.segments.every(segment =>
        typeof segment.id === 'number' &&
        typeof segment.start === 'number' &&
        typeof segment.end === 'number' &&
        typeof segment.text === 'string'
      )
    );
  } catch {
    return false;
  }
}

// Main function
async function main() {
  const args = parseArgs(Deno.args, {
    boolean: ["validate", "silent", "help"],
    string: ["input"],
    alias: { input: "i", validate: "v", silent: "s", help: "h" },
  });

  if (args.help) {
    console.log(`
Usage: deno run --allow-read --allow-write main.ts [OPTIONS]

Options:
  -i, --input <file>   Input file (JSON or VTT) (required)
  -v, --validate       Validate the input file without conversion
  -s, --silent         Suppress all console output
  -h, --help           Show this help message
    `);
    Deno.exit(0);
  }

  const inputFile = args.input;
  const validateOnly = args.validate;
  const silent = args.silent;

  if (!inputFile) {
    if (!silent) console.error("Please provide an input file using --input or -i.");
    Deno.exit(1);
  }

  try {
    const fileContent = await Deno.readTextFile(inputFile);
    const isJson = inputFile.toLowerCase().endsWith('.json');
    const isVtt = inputFile.toLowerCase().endsWith('.vtt');

    if (!isJson && !isVtt) {
      if (!silent) console.error("Input file must be either JSON or VTT.");
      Deno.exit(1);
    }

    if (isJson) {
      const isValidJson = validateJSON(fileContent);
      if (validateOnly) {
        if (!silent) console.log(isValidJson ? "JSON content is valid." : "JSON content is invalid.");
        Deno.exit(isValidJson ? 0 : 1);
      }
      if (isValidJson) {
        const transcriptionResponse = JSON.parse(fileContent) as TranscriptionResponse;
        const vttContent = jsonToVTT(transcriptionResponse);
        const { isValid, serializedVtt } = validateAndSerializeVTT(vttContent);
        if (isValid) {
          const outputFile = inputFile.replace(/\.json$/, '.vtt');
          await Deno.writeTextFile(outputFile, serializedVtt);
          if (!silent) console.log(`VTT file has been created: ${outputFile}`);
        } else {
          if (!silent) console.error("Generated VTT content is invalid. Conversion aborted.");
          Deno.exit(1);
        }
      } else {
        if (!silent) console.error("Invalid JSON content. Conversion aborted.");
        Deno.exit(1);
      }
    } else { // isVtt
      const { isValid, serializedVtt } = validateAndSerializeVTT(fileContent);
      if (!silent) {
        console.log(isValid ? "VTT content is valid." : "VTT content is invalid.");
      }
      if (!validateOnly && isValid) {
        await Deno.writeTextFile(inputFile, serializedVtt); // Overwrite with serialized content
        if (!silent) console.log(`VTT file has been serialized and saved: ${inputFile}`);
      }
      Deno.exit(isValid ? 0 : 1);
    }

  } catch (error: unknown) {
    if (!silent) {
      console.error("An error occurred:", error instanceof Error ? error.message : String(error));
    }
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
