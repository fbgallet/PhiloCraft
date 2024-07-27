export interface Concept {
  title: string;
  icon: string;
  field?: string;
  model?: string;
  count?: number;
}

let clonedConcepts: Concept[] = [];

export const setClonedConcepts = (data: Concept[]) => {
  clonedConcepts = data;
};

export const initialConcepts: Concept[] = [
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
