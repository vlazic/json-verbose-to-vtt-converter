// File: main.ts
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

// Main function
async function main() {
  const args = parseArgs(Deno.args, {
    string: ["input"],
    alias: { input: "i" },
  });

  const inputFile = args.input;

  if (!inputFile) {
    console.error("Please provide an input JSON file using --input or -i.");
    Deno.exit(1);
  }

  try {
    const jsonContent = await Deno.readTextFile(inputFile);
    const transcriptionResponse = JSON.parse(jsonContent) as TranscriptionResponse;
    const vttContent = jsonToVTT(transcriptionResponse);

    // Parse and validate VTT content
    const parser = new WebVTTParser();
    const parsedVtt = parser.parse(vttContent);

    if (parsedVtt.errors.length > 0) {
      console.warn("VTT content has some issues:");
      parsedVtt.errors.forEach((error: unknown, index: number) => {
        console.warn(`${index + 1}. ${String(error)}`);
      });
    } else {
      console.log("VTT content is valid.");
    }

    // Serialize the parsed VTT (this step ensures the output is well-formed)
    const serializer = new WebVTTSerializer();
    const serializedVtt = serializer.serialize(parsedVtt.cues);

    // Write VTT file
    const outputFile = inputFile.replace(/\.json$/, '.vtt');
    await Deno.writeTextFile(outputFile, serializedVtt);
    console.log(`VTT file has been created: ${outputFile}`);

  } catch (error: unknown) {
    console.error("An error occurred:", error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
