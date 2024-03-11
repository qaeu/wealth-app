"use server";

import OpenAI from "openai";
import { promises as fs } from "fs";

const openai = new OpenAI();

export const queryChatGPT = async (
  currentItem: string
): Promise<string | null | undefined> => {
  let promptFromFile: string;
  try {
    promptFromFile = await fs.readFile(process.cwd() + "/prompt.txt", "utf8");
  } catch {
    // For local deploys
    promptFromFile = await fs.readFile(
      process.cwd() + "/public/prompt.txt",
      "utf8"
    );
  }
  const prompt: string = promptFromFile.replace("${item}", currentItem);

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 50,
    });

    return completion.choices[0].message.content
      ? completion.choices[0].message.content
      : "";
  } catch (error) {
    console.error("Error fetching response from ChatGPT:", error);
    return "";
  }
};
