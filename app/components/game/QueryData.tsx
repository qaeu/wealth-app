"use server";

import * as ChatGPT from "../LLMAPI/ChatGPT";
import * as DB from "../DB/Postgres";
import { getOptionsPrompt } from "./Prompts";

interface ValueEstimate {
  lowerBound: number;
  upperBound: number;
}

export const queryValue = async (prompt: string): Promise<ValueEstimate> => {
  return ChatGPT.queryValue(prompt);
};

export const queryOptions = async (
  item: string,
  category: string
): Promise<string[]> => {
  const dboptions = await DB.queryOptions(item);

  if (dboptions) {
    return dboptions;
  }

  const prompt: string = getOptionsPrompt(item, category);
  const options: string[] = await ChatGPT.queryOptions(prompt);
  DB.insertOptions(item, options);
  return options;
};
