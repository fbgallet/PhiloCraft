import axios from "axios";
import { headers } from "../App";

interface BasicConcept {
  title: string;
  icon: string;
  field?: string;
}

export interface Concept extends BasicConcept {
  _id: string;
  isBasic?: boolean;
  category: string;
  explanation: [{}];
  logic: [string];
  philosopher: string;
  model?: string;
  timestamp: number;
  usedCounter: number;
  craftedCounter: number;
  isNew: boolean;
}

// export const basicConcepts: BasicConcept[] = [
//   { title: "Being", icon: "🌟", field: "metaphysic" },
//   { title: "Nothingness", icon: "🕳️", field: "metaphysic" },
//   { title: "Principle", icon: "🏛️", field: "metaphysic" },
//   { title: "Cause", icon: "🔗", field: "metaphysic" },
//   { title: "Identity", icon: "🟰", field: "logic" },
//   { title: "Contradiction", icon: "⊥", field: "logic" },
//   { title: "Implication", icon: "➡️", field: "logic" },
//   { title: "Consistency", icon: "✅", field: "logic" },
//   { title: "Truth", icon: "🔍", field: "epistemology" },
//   { title: "Belief", icon: "🙏", field: "epistemology" },
//   { title: "Justification", icon: "⚖️", field: "epistemology" },
//   { title: "Experience", icon: "🧪", field: "epistemology" },
//   { title: "Consciousness", icon: "💡", field: "philosophy of mind" },
//   { title: "Free will", icon: "🤔", field: "philosophy of mind" },
//   { title: "Personal identity", icon: "🪪", field: "philosophy of mind" },
//   { title: "Reason", icon: "🧠", field: "philosophy of mind" },
//   { title: "Good", icon: "😇", field: "ethic" },
//   { title: "Duty", icon: "📌", field: "ethic" },
//   { title: "Value", icon: "⚖️", field: "ethic" },
//   { title: "Others", icon: "👥", field: "ethic" },
//   { title: "Justice", icon: "⚖️", field: "political philosophy" },
//   { title: "Freedom", icon: "🕊️", field: "political philosophy" },
//   { title: "Power", icon: "👑", field: "political philosophy" },
//   { title: "Law", icon: "📜", field: "political philosophy" },
//   { title: "Beauty", icon: "🌺", field: "aesthetics" },
//   { title: "Taste", icon: "👁️", field: "aesthetics" },
//   { title: "Feelings", icon: "💖", field: "aesthetics" },
//   { title: "Genius", icon: "👩‍🎨", field: "aesthetics" },
//   { title: "Language", icon: "🗣️", field: "other fields" },
//   { title: "History", icon: "📜", field: "other fields" },
//   { title: "Religion", icon: "🙏", field: "other fields" },
//   { title: "Nature", icon: "🌿", field: "other fields" },
//   { title: "Technology", icon: "💻", field: "other fields" },
//   { title: "Society", icon: "👥", field: "other fields" },
// ];

export let clonedConcepts: Concept[] = [];

export const setClonedConcepts = (data: Concept[]) => {
  clonedConcepts = data;
};

export const initializeBasicConcepts = async (): Promise<Concept[] | []> => {
  const initializedBasicConcepts = [];
  try {
    for (const basic of basicConcepts) {
      const { data } = await axios.post(
        "http://localhost:3001/concept/create",
        {
          title: basic.title,
          icon: basic.icon,
          field: [basic.field],
          category: "Ordinary",
          isBasic: true,
        },
        headers
      );
      initializedBasicConcepts.push(data);
      console.log("basic concept loaded from DB:>> ", data);
    }
    return initializedBasicConcepts;
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};
