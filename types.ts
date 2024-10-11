export interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResponse {
  task: string;
  language: string;
  duration: number;
  text: string;
  segments: Segment[];
}
