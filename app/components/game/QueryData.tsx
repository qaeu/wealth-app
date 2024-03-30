"use server";

import * as ChatGPT from "../LLMAPI/ChatGPT";
import * as DB from "../DB/Postgres";
import { getValuePrompt, getOptionsPrompt } from "./Prompts";

interface ValueEstimate {
  lowerBound: number;
  upperBound: number;
}

export const queryValue = async (item: string): Promise<ValueEstimate> => {
  const dbValue = await DB.queryValue(item);

  if (dbValue) {
    return { lowerBound: dbValue[0], upperBound: dbValue[1] };
  }

  const prompt = getValuePrompt(item);
  const value = await ChatGPT.queryValue(prompt);
  DB.insertValue(item, [value.lowerBound, value.upperBound]);
  return value;
};

export const queryOptions = async (
  item: string,
  category: string
): Promise<string[]> => {
  const dbOptions = await DB.queryOptions(item);

  if (dbOptions) {
    return dbOptions;
  }

  const prompt: string = getOptionsPrompt(item, category);
  const options: string[] = await ChatGPT.queryOptions(prompt);
  DB.insertOptions(item, options);
  return options;
};
