import { TranscriptionResponse } from "./types.ts";
import { formatTime } from "./utils.ts";

export function jsonToVTT(json: TranscriptionResponse): string {
  let vtt = "WEBVTT\n\n";
  json.segments.forEach((segment) => {
    vtt += `${formatTime(segment.start)} --> ${formatTime(segment.end)}\n`;
    vtt += `${segment.text.trim()}\n\n`;
  });
  return vtt;
}
