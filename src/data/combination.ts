import { Concept } from "./concept";

export interface Combination {
  id: string;
  combined: [Concept, Concept];
  result: Concept;
  logic: string;
  field?: string;
  model?: string;
  count?: number;
}
