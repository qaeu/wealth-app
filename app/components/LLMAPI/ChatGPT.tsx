"use server";

import OpenAI from "openai";
import { encodingForModel } from "js-tiktoken";

interface ValueEstimate {
  lowerBound: number;
  upperBound: number;
}

const MODEL = "gpt-4o-mini";
const IGNORE_STRINGS: string[] = ["a", "an", " of"];
const PARAMS = {
  maxTokens: 70,
  frequencyPenalty: 0.2,
  temperature: 1.3,
  logitBiasVal: -5,
};

const openai = new OpenAI();
let previousTokens: number[] = [];

export const queryValue = async (prompt: string): Promise<ValueEstimate> => {
  const parseResponse = (response: string) => {
    try {
      const values = response.split(" ").map((val) => Number(val));
      return { lowerBound: values[0], upperBound: values[1] };
    } catch (error) {
      throw error;
    }
  };

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: MODEL,
      max_tokens: 10,
      temperature: PARAMS.temperature,
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

export const queryOptions = async (prompt: string): Promise<string[]> => {
  const parseResponse = (response: string) => {
    try {
      const options: string[] = JSON.parse(response).items;
      setPreviousTokens(options);
      return options;
    } catch (error) {
      throw error;
    }
  };

  const setPreviousTokens = (options: string[]) => {
    previousTokens = tokeniseAll(options);
    const ignoreTokens: number[] = tokeniseAll(IGNORE_STRINGS);
    previousTokens = previousTokens.filter(
      (token) => !ignoreTokens.includes(token)
    );
  };

  const tokeniseAll = (input: string[]): number[] => {
    const enc = encodingForModel(MODEL);
    const tokens: number[][] = input.map((option) =>
      Array.from(enc.encode(option))
    );
    return tokens.reduce((prev, token) => [...prev, ...token]);
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
