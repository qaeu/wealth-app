"use server";

import OpenAI from "openai";

const openai = new OpenAI();

export const queryChatGPT = async (
  prompt: string
): Promise<string | null | undefined> => {
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
