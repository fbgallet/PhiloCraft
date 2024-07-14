const emojiRegex = /[^\p{L}\s]/u;
const conceptOnlyRegex = /^[^\p{L}]*([\p{L}\p{Zs}-]+)[^\p{L}]*$/u;

export const concepts = [
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

export const combinationsDB =
  (localStorage.InfinitCombinations &&
    JSON.parse(localStorage.InfinitCombinations)) ||
  [];

export const addToExistingConcepts = ({ title, icon }) => {
  const isExisting = concepts.find((concept) => title === concept.title);
  if (!isExisting) {
    concepts.push({ title, icon });
    return null;
  } else return isExisting;
};

export const getConceptTitle = (label: string) => {
  let matchingConcept = label.match(conceptOnlyRegex);
  return matchingConcept ? matchingConcept[1].trim() : "";
};

export const getConceptIcon = (label: string) => {
  const matchingIcon = label.match(emojiRegex);
  return matchingIcon ? matchingIcon[0].trim() : "";
};

export const getStoredCombination = (tulpe: [string, string]) => {
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
    return existingCombination.result;
  }
  return null;
};
