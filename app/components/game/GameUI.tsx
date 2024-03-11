"use client";

import { useState } from "react";
import { queryChatGPT } from "../LLMAPI/ChatGPT";
import OptionList from "./OptionList/OptionList";

interface GameUIProps {
  initItem: string;
  initOptions: string[];
  initPrompt: string;
}

const GameUI: React.FC<GameUIProps> = ({
  initItem,
  initOptions,
  initPrompt,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState(initItem);
  const [options, setOptions] = useState(initOptions);

  const handleButtonClick = async (buttonText: string) => {
    setIsLoading(true);
    setCurrentItem(buttonText);

    const prompt: string = initPrompt.replace("${item}", currentItem);
    const itemsStr: string | null | undefined = await queryChatGPT(prompt);
    if (itemsStr) {
      try {
        setOptions(JSON.parse(itemsStr).items);
      } catch (error) {
        console.error("Error parsing ChatGPT response:", itemsStr, error);
      }
    }
    setIsLoading(false);
  };

  const dialogue = "You have " + currentItem + ".\nSelect an item to trade for";

  return (
    <div className="z-10 max-w-5xl font-mono text-sm">
      <p className="my-10 border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl static w-auto rounded-xl border bg-gray-200 p-4">
        {dialogue}
      </p>
      {isLoading ? (
        <OptionList
          items={options.map(() => "...")}
          handleButtonClick={() => {}}
        />
      ) : (
        <OptionList items={options} handleButtonClick={handleButtonClick} />
      )}
    </div>
  );
};

export default GameUI;
