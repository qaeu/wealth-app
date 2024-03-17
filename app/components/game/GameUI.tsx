"use client";

import { useState } from "react";
import { queryOptions, queryValue } from "../LLMAPI/ChatGPT";
import OptionList from "./OptionList/OptionList";
import CATEGORIES from "./Categories";
import { getOptionsPrompt, getValuePrompt } from "./Prompts";

interface GameUIProps {
  initItem: string;
  initCategory: string;
  initOptions: string[];
}

interface GameState {
  currentItem: string;
  currentCategory: string;
  options: string[];
  loopCount: number;
}

const GameUI: React.FC<GameUIProps> = ({
  initItem,
  initCategory,
  initOptions,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentItem: initItem,
    currentCategory: initCategory,
    options: initOptions,
    loopCount: 0,
  });

  const updateCategory = async (newItem: string) => {
    const valuePrompt = getValuePrompt(newItem);
    let newValue: number = 0;
    try {
      newValue = await queryValue(valuePrompt);
    } catch (error) {
      console.log(error);
      return gameState.currentCategory;
    }

    let bestCat: string = CATEGORIES[0].title;
    for (const cat of CATEGORIES) {
      if (newValue >= cat.breakpoint) {
        bestCat = cat.title;
      } else {
        break;
      }
    }
    return bestCat;
  };

  const handleButtonClick = async (buttonText: string) => {
    setIsLoading(true);
    const selectedItem = buttonText;
    const oldItem = gameState.currentItem;
    setGameState({ ...gameState, currentItem: selectedItem });

    const updatedCategory =
      gameState.loopCount % 2 == 1
        ? await updateCategory(buttonText)
        : gameState.currentCategory;

    const prompt: string = getOptionsPrompt(buttonText, updatedCategory);
    try {
      const newItems: string[] = await queryOptions(prompt);
      setGameState({
        currentItem: buttonText,
        currentCategory: updatedCategory,
        options: newItems,
        loopCount: gameState.loopCount + 1,
      });
    } catch (error) {
      console.error(error);
      setGameState({ ...gameState, currentItem: oldItem });
    }
    setIsLoading(false);
  };

  const dialogue = [
    `You have ${gameState.currentItem}. `,
    `Select an item to trade for:`,
  ];

  return (
    <div className="z-10 max-w-5xl font-mono text-sm">
      <p className="my-10 border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl static w-auto rounded-xl border bg-gray-200 p-4">
        {dialogue.map((txt, i) => (
          <span key={i}>
            {txt} <br />
          </span>
        ))}
      </p>
      {isLoading ? (
        <OptionList
          items={gameState.options.map(() => "...")}
          handleButtonClick={() => {}}
        />
      ) : (
        <OptionList
          items={gameState.options}
          handleButtonClick={handleButtonClick}
        />
      )}
    </div>
  );
};

export default GameUI;
