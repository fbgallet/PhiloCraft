// import axios from "axios";
import { Concept } from "../data/concept";

export interface ConceptsCombination {
  combined: [string, string];
  result: string;
  count: number;
}

export const combinationsDB: ConceptsCombination[] =
  (localStorage.InfinitCombinations &&
    JSON.parse(localStorage.InfinitCombinations)) ||
  [];

export const getStoredUserConcepts = (language: string): Concept[] | [] => {
  return (
    (localStorage[`userConcepts_${language}`] &&
      JSON.parse(localStorage[`userConcepts_${language}`])) ||
    []
  );
};
export const getStoredBasicConcepts = (
  language: string
): Concept[] | undefined => {
  return (
    localStorage[`basicConcepts_${language}`] &&
    JSON.parse(localStorage[`basicConcepts_${language}`])
  );
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

export function getRandomElement<T>(array: T[]): T | null {
  if (array.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export const getSplittedConceptAndLogic = (str: string) => {
  const splitted = str.split(">>");

  return splitted.length === 2
    ? {
        concept: splitted[1].trim(),
        logic: splitted[0].trim(),
      }
    : { concept: undefined, logic: undefined };
};
