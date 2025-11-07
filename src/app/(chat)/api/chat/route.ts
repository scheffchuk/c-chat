import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

// TODO: getTokenlensCatalog function