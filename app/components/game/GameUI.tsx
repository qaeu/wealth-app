"use client";

import { useState } from "react";
import { queryChatGPT } from "../LLMAPI/ChatGPT";
import OptionList from "./OptionList/OptionList";

interface GameUIProps {
  initItem: string;
  initOptions: string[];
}

const GameUI: React.FC<GameUIProps> = ({ initItem, initOptions }) => {
  const handleButtonClick = async (buttonText: string) => {
    setCurrentItem(buttonText);

    const itemsStr: string | null | undefined = await queryChatGPT(currentItem);
    if (itemsStr) {
      try {
        setOptions(JSON.parse(itemsStr).items);
      } catch (error) {
        console.error("Error parsing ChatGPT response:", itemsStr, error);
      }
    }
  };

  const [currentItem, setCurrentItem] = useState(initItem);
  const [options, setOptions] = useState(initOptions);

  const dialogue = "You have " + currentItem + ".\nSelect an item to trade for";

  return (
    <div className="z-10 max-w-5xl font-mono text-sm">
      <p className="my-10 border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl static w-auto rounded-xl border bg-gray-200 p-4">
        {dialogue}
      </p>
      <OptionList items={options} handleButtonClick={handleButtonClick} />
    </div>
  );
};

export default GameUI;
