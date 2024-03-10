import OpenAI from "openai";

const openai = new OpenAI();

interface ChatGPTProps {
  query: string;
}

const ChatGPT: React.FC<ChatGPTProps> = async ({ query }) => {
  let output;
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: query }],
      model: "gpt-3.5-turbo",
      max_tokens: 10,
    });

    output = completion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching response from ChatGPT:", error);
  }

  return output;
};

export default ChatGPT;
