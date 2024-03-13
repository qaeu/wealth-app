import { promises as fs } from "fs";
import { queryChatGPT } from "../LLMAPI/ChatGPT";
import GameUI from "./GameUI";

const Game = async () => {
  const currentItem: string = "a paperclip";
  let tradeOptions: string[] = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const promptFromFile = await fs.readFile(
    process.cwd() + "/app/components/game/prompt.txt",
    "utf8"
  );
  const prompt: string = promptFromFile.replace("${item}", currentItem);

  try {
    tradeOptions = await queryChatGPT(prompt);
  } catch (error) {
    console.error(error);
  }

  return (
    <GameUI
      initItem={currentItem}
      initOptions={tradeOptions}
      initPrompt={promptFromFile}
    />
  );
};

export default Game;
