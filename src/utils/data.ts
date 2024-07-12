const emojiRegex = /[^\p{L}\s]/u;
const conceptOnlyRegex = /^[^\p{L}]*([\p{L}\p{Zs}]+)[^\p{L}]*$/u;

export const concepts = [
  {
    title: "Being",
    icon: "🌟",
  },
  {
    title: "Opposite",
    icon: "❌",
  },
  {
    title: "Good",
    icon: "😇",
  },
  {
    title: "Truth",
    icon: "🔍",
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

export const addToExistingConcepts = ({ title, icon }) => {
  console.log("title :>> ", title);
  const isExisting = concepts.find((concept) => title === concept.title);
  console.log("isExisting :>> ", isExisting);
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
