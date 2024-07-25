const emojiRegex: RegExp = /[^\p{L}\s]/u;
const conceptOnlyRegex: RegExp = /^[^\p{L}]*([\p{L}\p{Zs}-]+)[^\p{L}]*$/u;

export interface Concept {
  title: string;
  icon: string;
}

export const concepts: Concept[] = [
  {
    title: "Being",
    icon: "🌟",
  },
  {
    title: "Good",
    icon: "😇",
  },
  {
    title: "Truth",
    icon: "🔍",
  },
  {
    title: "Opposite",
    icon: "❌",
  },
];
// export const concepts = [
//   {
//     title: "Etre",
//     icon: "",
//   },
//   {
//     title: "Négation",
//     icon: "",
//   },
//   {
//     title: "Identité",
//     icon: "",
//   },
//   {
//     title: "Matière",
//     icon: "",
//   },
// ];

export interface ConceptsCombination {
  combined: [string, string];
  result: string;
  count: number;
}

export const combinationsDB: ConceptsCombination[] =
  (localStorage.InfinitCombinations &&
    JSON.parse(localStorage.InfinitCombinations)) ||
  [];

export const addToExistingConcepts = ({
  title,
  icon,
}: Concept): Concept | null => {
  const existingCpt: Concept | undefined = concepts.find(
    (concept) => title === concept.title
  );
  if (!existingCpt) {
    concepts.push({ title, icon });
    return null;
  } else return existingCpt;
};

export const getConceptTitle = (label: string): string => {
  let matchingConcept = label.match(conceptOnlyRegex);
  return matchingConcept ? matchingConcept[1].trim() : "";
};

export const getConceptIcon = (label: string): string => {
  const matchingIcon = label.match(emojiRegex);
  return matchingIcon ? matchingIcon[0].trim() : "";
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
  console.log("existingCombination :>> ", existingCombination);
  if (existingCombination) {
    existingCombination.count++;
    return existingCombination;
  }
  return null;
};
