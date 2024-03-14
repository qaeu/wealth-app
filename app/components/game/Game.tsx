import { queryOptions } from "../LLMAPI/ChatGPT";
import GameUI from "./GameUI";
import CATEGORIES from "./Categories";
import { getOptionsPrompt } from "./Prompts";

const Game = async () => {
  const startItem: string = "📎 a paperclip";
  const startCategory: string = CATEGORIES[1].title;
  let tradeOptions: string[] = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const prompt: string = getOptionsPrompt(startItem, startCategory);

  try {
    tradeOptions = await queryOptions(prompt);
  } catch (error) {
    console.error(error);
  }

  return (
    <GameUI
      initItem={startItem}
      initCategory={startCategory}
      initOptions={tradeOptions}
    />
  );
};

export default Game;
