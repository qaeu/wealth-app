import { promises as fs } from "fs";
import { queryOptions } from "../LLMAPI/ChatGPT";
import GameUI from "./GameUI";
import CATEGORIES from "./Categories";
import { start } from "repl";

const Game = async () => {
  const startItem: string = "a paperclip";
  const startCategory: string = CATEGORIES[1].title;
  let tradeOptions: string[] = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const promptFromFile = await fs.readFile(
    process.cwd() + "/app/components/game/prompt.txt",
    "utf8"
  );
  const prompt: string = promptFromFile
    .replace("${item}", startItem)
    .replace("${category}", startCategory);

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
      initPrompt={promptFromFile}
    />
  );
};

export default Game;
