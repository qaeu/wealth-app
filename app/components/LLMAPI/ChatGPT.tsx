"use server";

import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";

const MODEL = "gpt-3.5-turbo";
const IGNORE_STRINGS: string[] = ["a", "an", " of"];
const PARAMS = {
  maxTokens: 50,
  frequencyPenalty: 0.2,
  temperature: 1.1,
  logitBiasVal: -5,
};

const openai = new OpenAI();
const enc = encoding_for_model(MODEL);
let previousTokens: number[] = [];

export const queryChatGPT = async (prompt: string): Promise<string[]> => {
  const parseResponse = (response: string): string[] => {
    try {
      const options: string[] = JSON.parse(response).items;
      setPreviousTokens(options);
      return options;
    } catch (error) {
      throw error;
    }
  };

  const setPreviousTokens = (options: string[]): void => {
    const tokens: number[][] = options.map((option) =>
      Array.from(enc.encode(option))
    );
    previousTokens = tokens.reduce((prev, token) => [...prev, ...token]);

    const ignoreStringsTokens: number[][] = IGNORE_STRINGS.map((item) =>
      Array.from(enc.encode(item))
    );
    const ignoreTokens: number[] = ignoreStringsTokens.reduce((prev, token) => [
      ...prev,
      ...token,
    ]);
    previousTokens = previousTokens.filter(
      (token) => !ignoreTokens.includes(token)
    );
  };

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: MODEL,
      max_tokens: PARAMS.maxTokens,
      frequency_penalty: PARAMS.frequencyPenalty,
      response_format: { type: "json_object" },
      temperature: PARAMS.temperature,
      logit_bias: previousTokens.reduce(
        (prev, token) => ({
          ...prev,
          [token]: PARAMS.logitBiasVal,
        }),
        {}
      ),
    });

    const output: string | null = completion.choices[0].message.content;

    if (output) {
      return parseResponse(output);
    } else {
      throw "blank response from ChatGPT";
    }
  } catch (error) {
    console.error("Error fetching response from ChatGPT:", error);
    throw "Error fetching response from ChatGPT";
  }
};
