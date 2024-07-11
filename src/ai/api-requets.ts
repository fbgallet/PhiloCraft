// import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";

const prompt =
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

export const claudeAPImessage = async (
  content: string,
  isCombination: boolean = true
) => {
  try {
    const { data } = await axios.post(
      "http://localhost:3000/anthropic/message",
      // "https://site--ai-api-back--2bhrm4wg9nqn.code.run/anthropic/message",
      // See server code here: https://github.com/fbgallet/ai-api-back
      // No data is stored on the server or displayed in any log
      {
        key: null,
        prompt: (isCombination ? prompt : "") + content,
        // context: content,
        model: "claude-3-haiku-20240307",
      }
    );
    // console.log(data);
    return data.response.content[0].text;
  } catch (error: any) {
    console.log(error.response?.data?.message);
  }
};
