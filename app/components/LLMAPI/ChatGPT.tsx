"use server";

import OpenAI from "openai";

const openai = new OpenAI();

export const queryChatGPT = async (prompt: string): Promise<string[]> => {
  const decodeResponse = (response: string): string[] => {
    try {
      const options = JSON.parse(response).items;
      return options;
    } catch (error) {
      throw error;
    }
  };

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 50,
      frequency_penalty: 0.2,
      response_format: { type: "json_object" },
      temperature: 1.1,
    });

    const output: string | null = completion.choices[0].message.content;

    if (output) {
      return decodeResponse(output);
    } else {
      throw "blank response from ChatGPT";
    }
  } catch (error) {
    console.error("Error fetching response from ChatGPT:", error);
    throw "Error fetching response from ChatGPT";
  }
};
