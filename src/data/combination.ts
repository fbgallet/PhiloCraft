import { Concept } from "./concept";

export interface Combination {
  id: string;
  combined: [Concept, Concept];
  result: Concept;
  field?: string;
  model?: string;
  count?: number;
}
