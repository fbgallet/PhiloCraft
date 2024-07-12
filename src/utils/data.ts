const emojiRegex = /[\p{Emoji}]+/u;
const conceptOnlyRegex = /[^\p{Emoji}\s].*[^\p{Emoji}\s]/u;

export const concepts = [
  {
    title: "Being",
    icon: "🌟",
  },
  {
    title: "Nothingness",
    icon: "⚫",
  },
  {
    title: "Identity",
    icon: "🪞",
  },
  {
    title: "Principle",
    icon: "🏛️",
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
  return matchingConcept ? matchingConcept[0].trim() : "";
};

export const getConceptIcon = (label: string) => {
  const matchingIcon = label.match(emojiRegex);
  return matchingIcon ? matchingIcon[0].trim() : "";
};
