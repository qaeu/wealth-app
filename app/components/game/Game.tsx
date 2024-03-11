import { queryChatGPT } from "../LLMAPI/ChatGPT";
import GameUI from "./GameUI";

const Game = async () => {
  let currentItem: string = "a paperclip";
  let tradeOptions: string[] = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const itemsStr: string | null | undefined = await queryChatGPT(currentItem);
  if (itemsStr) {
    try {
      tradeOptions = JSON.parse(itemsStr).items;
    } catch (error) {
      console.error("Error parsing ChatGPT response:", itemsStr, error);
    }
  }

  return <GameUI initItem={currentItem} initOptions={tradeOptions} />;
};

export default Game;
