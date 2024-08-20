// import axios from "axios";
import { Concept } from "../data/concept";

const emojiRegex: RegExp = /[^\p{L}\s]/u;
const conceptOnlyRegex: RegExp = /^[^\p{L}]*([\p{L}\p{Zs}-]+)[^\p{L}]*$/u;

export interface ConceptsCombination {
  combined: [string, string];
  result: string;
  count: number;
}

export const combinationsDB: ConceptsCombination[] =
  (localStorage.InfinitCombinations &&
    JSON.parse(localStorage.InfinitCombinations)) ||
  [];

export const getStoredUserconcepts = (): Concept[] | undefined => {
  return localStorage.userConcepts && JSON.parse(localStorage.userConcepts);
};

export const addToExistingConcepts = async (
  { title, icon }: Concept,
  userConcepts: Concept[],
  concepts: Concept[]
): Promise<Concept | null> => {
  let existingCpt = getConceptLocaly(title, userConcepts);
  // if (!existingCpt) {
  //   existingCpt = await getConceptDistant(title);
  // }
  if (!existingCpt) {
    // concepts.push({ title, icon });
    return null;
  } else return existingCpt;
};

const getConceptLocaly = (
  title: string,
  concepts: Concept[]
): Concept | null => {
  return concepts.find((concept) => title === concept.title) || null;
};

// const getConceptDistant = async (title: string): Promise<Concept | null> => {
//   try {
//     const response = await axios.post("http://localhost:3001/concept/bytitle", {
//       title,
//     });
//     const concept: Concept = response.data;
//     return concept;
//   } catch (error: any) {
//     console.log(error.response);
//     return null;
//   }
// };

// export const getConceptTitle = (label: string): string => {
//   let matchingConcept = label.match(conceptOnlyRegex);
//   return matchingConcept ? matchingConcept[1].trim() : "";
// };

// export const getConceptIcon = (label: string): string => {
//   const matchingIcon = label.match(emojiRegex);
//   return matchingIcon ? matchingIcon[0].trim() : "";
// };

export const getStoredCombination = (
  tulpe: [string, string]
): ConceptsCombination | null => {
  const existingCombination = combinationsDB.find(
    (combination) =>
      (combination.combined[0] === tulpe[0] &&
        combination.combined[1] === tulpe[1]) ||
      (combination.combined[0] === tulpe[1] &&
        combination.combined[1] === tulpe[0])
  );

  if (existingCombination) {
    existingCombination.count++;
    return existingCombination;
  }
  return null;
};
