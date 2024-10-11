import { parseArgs } from "@std/cli/parse-args";
import { WebVTTParser, WebVTTSerializer } from "npm:webvtt-parser-esm";
import { TranscriptionResponse } from "./types.ts";
import { jsonToVTT } from "./converter.ts";

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
      parsedVtt.errors.forEach((error, index) => {
        console.warn(`${index + 1}. ${error.message}`);
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

  } catch (error) {
    console.error("An error occurred:", error.message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
