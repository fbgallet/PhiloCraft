import { Concept } from "./concept";

export interface Combination {
  _id: string;
  combined: [string, string];
  result: string | Concept; // only concept._id or populated Concept
  otherResults: [string];
  logic: string;
  field?: string;
  model?: string;
  counter: number;
}
