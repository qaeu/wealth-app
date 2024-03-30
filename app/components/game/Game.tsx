import { queryOptions } from "../LLMAPI/ChatGPT";
import GameUI from "./GameUI";
import CATEGORIES from "./Categories";
import { getOptionsPrompt } from "./Prompts";

const Game = async () => {
  const startItem: string = "📎 a paperclip";
  const startCategory: string = CATEGORIES[0].titles[0];
  const startOptions: string[] = [
    "🍬 a gummy bear",
    "📝 a single sheet of A5 paper",
    "🌱 some carrot seeds",
    "🐜 an ant",
  ];
  const prompt: string = getOptionsPrompt(startItem, startCategory);

  return (
    <GameUI
      initItem={startItem}
      initCategory={startCategory}
      initOptions={startOptions}
    />
  );
};

export default Game;
