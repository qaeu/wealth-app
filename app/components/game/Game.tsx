import { promises as fs } from "fs";
import ChatGPT from "../LLMAPI/ChatGPT";
import OptionList from "./OptionList/OptionList";

const Game = async () => {
  const dialogue: string = "Select an item to trade for";
  let wealth: number = 1;
  const promptFromFile: string = await fs.readFile(
    process.cwd() + "/app/components/game/prompt.txt",
    "utf8"
  );
  const prompt: string = promptFromFile.replace("${wealth}", wealth.toString());
  let items: string[] = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const itemsStr: string | null | undefined = await ChatGPT(prompt);
  if (prompt && itemsStr) {
    try {
      items = JSON.parse(itemsStr).items;
    } catch (error) {
      console.log("Error parsing ChatGPT response:", itemsStr, error);
    }
  }

  return (
    <div className="z-10 max-w-5xl font-mono text-sm">
      <p className="my-10 border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl static w-auto rounded-xl border bg-gray-200 p-4">
        {dialogue}
      </p>
      <OptionList items={items} />
    </div>
  );
};

export default Game;
