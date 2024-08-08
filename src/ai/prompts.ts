const contextEnPrompt = `
CONTEXT:
A game to explore philosophical concepts and terms of philosocal interest, discover new ones. The player seeks to discover new combinations of concepts and enjoys being surprised by the obtained result, which give food for thought.

`;
const formatPrompt = `
FORMAT OF YOUR RESPONSE:
- Your response is only a SINGLE WORD without a pronoun, or a VERY SHORT EXPRESSION starting with an uppercase letter, but NEVER a phrase,
- Insert a SINGLE emoji that best symbolize itBEFORE the corresponding concept, followed by a single space.`;

export const mixTwoEnPrompt =
  contextEnPrompt +
  `
YOUR JOB:
Your response has to be a term of philosophical interest or a philosophical concept that would be the most relevant result of the combination of the two terms provided at the end of this prompt, following this logic if this make sens: [term 1] of [term 2] is [your resulting term]. E.g.: Opposite of Good is Evil, Nothingness of Being is Becoming, Conscience of Conscience is Reflexivity.

Here are the rules to strictly follow in formulating your response:
- the term that you provide has response can be a common everyday word, of common sense, not necessarily a concept coined by a philosopher.
- it must exist in English, have been used by philosophers. Do not create new word.
- simple and accessible terms or concepts are preferred, while terms from Greek or other foreign languages should be avoided unless entirely relevant.
- It can concern any field of philosophy, be of interest in general or in particular in certain branches such as metaphysics, ethics, epistemology, political philosophy, aesthetics, philosophy of mind, philosophy of culture or technology, etc.
` +
  formatPrompt +
  `
PROVIDED TERMS TO COMBINE:
`;

export const randomConceptEnPrompt =
  contextEnPrompt +
  `
YOUR JOB:
- Give a SINGLE random term of philosophical interest or a philosophical concept, this can be a common everyday word, of common sense, not necessarily a concept coined by a philosopher. Simple and accessible terms or concepts are preferred.
- The SINGLE term you choose can concern any field of philosophy, be of interest in general or in particular in certain branches such as metaphysics, ethics, epistemology, political philosophy, aesthetics, philosophy of mind, philosophy of culture or technology, etc.
- This term must exist in English and have been commonly used by philosophers.
` +
  formatPrompt;

/**********/
// FRENCH //
/**********/

export const mixTwoFrPrompt =
  "Propose un concept philosophique (sous la forme d'un seul mot ou d'un bref syntagme " +
  "qui articule plusieurs mots, par exemple conscience morale, mais EN AUCUN CAS une phrase " +
  "NI une explication) qui correspondrait le mieux à la synthèse des deux concepts " +
  "proposés à la fin de ce prompt. Il fait proposer un terme qui serait comme le résultat " +
  "du mélange 'chimique' des deux autres ou qui surgirait à l'esprit de celui qui les articulerait. " +
  "Le concept proposé doit exister dans ma langue, " +
  "avoir été couramment utilisé par des philosophes, et exprimer une idée qui n'est pas équivalente " +
  "à l'idée exprimée par chacun des termes proposés. Il faut fournir un concept du même ordre " +
  "que ceux proposés, c'est-à-dire qui relève du même type de réalité (par ex. deux vertus " +
  "doivent donner une autre vertus, pas un courant philosophique), du même registre et du même niveau de langue. " +
  "De manière générale, sauf si la synthèse demandée est très pointue, les concepts simples et accessibles sont à privilégier, " +
  "les termes issus du grec ou d'autres langues étrangères sont à éviter sauf s'ils sont totalement pertinents." +
  "Insère avant le concept une émoji qui pourrait le symboliser au mieux, ou une suite d'émoji si nécessaire. " +
  "Voici les deux termes proposés: ";

export const randomConceptFrPrompt = `Propose aléatoirement UN et UN SEUL terme (ou syntagme) issu du vocabulaire philosophique ou sur lequel peuvent porter les discussions philosophiques,
dans tous les domaines possibles que peut aborder la philosophie.
Fournis rien le terme ou concept, SANS phrase NI explication, précédé d'une émoji qui pourrait le symboliser.
Le terme peut être un objet de discussion commun comme la conscience, liberté, le courage, ou un concept introduit par des philosophes pour résoudre un problème ou représenter une idée originale.`;
