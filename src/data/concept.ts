interface BasicConcept {
  title: string;
  icon: string;
  field?: string;
}

export interface Concept extends BasicConcept {
  _id: string;
  isBasic: boolean;
  category: string;
  explanation: [{ model: string; content: {} }];
  logic: [string];
  philosopher: string;
  model?: string;
  timestamp: number;
  usedCounter: number;
  craftedCounter: number;
  isNew: boolean;
}
