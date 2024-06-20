// import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";

const prompt =
  "Propose un concept philosophique (sous la forme d'un seul mot ou d'un syntagme " +
  "qui articule plusieurs mots, par exemple conscience morale, mais en aucun cas une phrase " +
  "ni aucune explication) qui pourrait correspondre à la combinaison des deux concepts " +
  "proposés à la fin de ce prompt. Le concept proposé doit exister dans ma langue, " +
  "avoir déjà été utilisé par un philosophe, et exprimer une idée qui n'est pas équivalente " +
  "à l'idée exprimée par les termes proposés. Il faut fournir un concept du même ordre " +
  "que ceux proposés, c'est-à-dire qui relève du même type de réalité (par ex. deux vertus " +
  "doivent donner une autre vertus, mais pas un courant philosophique). " +
  "Insère avant le concept une émoji qui pourrait le symboliser. " +
  "Voici les deux termes proposés: ";

export const claudeAPImessage = async (
  content: string,
  isCombination: boolean = true
) => {
  try {
    const { data } = await axios.post(
      "http://localhost:3000/anthropic/message",
      //   "https://site--ai-api-back--2bhrm4wg9nqn.code.run/anthropic/message",
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
