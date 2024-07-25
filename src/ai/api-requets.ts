// import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";
import { mixTwoEnPrompt } from "./prompts.ts";

export const claudeAPImessage = async (
  content: string,
  isCombination: boolean = true
): Promise<string | undefined> => {
  try {
    const { data } = await axios.post(
      "http://localhost:3000/anthropic/message",
      // "https://site--ai-api-back--2bhrm4wg9nqn.code.run/anthropic/message",
      // See server code here: https://github.com/fbgallet/ai-api-back
      // No data is stored on the server or displayed in any log
      {
        key: null,
        prompt: (isCombination ? mixTwoEnPrompt : "") + content,
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
