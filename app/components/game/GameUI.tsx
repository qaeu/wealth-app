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
      const boundEstimates = await queryValue(valuePrompt);
      newValue =
        Math.floor(
          Math.random() *
            (boundEstimates.upperBound - boundEstimates.lowerBound + 1)
        ) + boundEstimates.lowerBound; // Random value within the estimated bounds
    } catch (error) {
      console.error(error);
      return gameState.currentCategory;
    }

    let bestCat = CATEGORIES[0];
    for (const cat of CATEGORIES) {
      if (newValue >= cat.breakpoint) {
        bestCat = cat;
      } else {
        break;
      }
    }
    const randomIndex = Math.floor(Math.random() * bestCat.titles.length);
    return bestCat.titles[randomIndex];
  };

  const handleButtonClick = async (buttonText: string) => {
    setIsLoading(true);
    const selectedItem = buttonText;
    const oldItem = gameState.currentItem;
    setGameState({ ...gameState, currentItem: selectedItem });

    const updatedCategory =
      gameState.loopCount % 2 == 1
        ? await updateCategory(selectedItem)
        : gameState.currentCategory;

    const prompt: string = getOptionsPrompt(selectedItem, updatedCategory);
    try {
      const newItems: string[] = await queryOptions(prompt);
      setGameState({
        currentItem: selectedItem,
        currentCategory: updatedCategory,
        options: newItems,
        loopCount: gameState.loopCount + 1,
      });
      document.title = selectedItem;
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
    <div className="z-10 max-w-lg font-mono text-sm text-slate-900">
      <p className="static w-auto my-10 p-4 border-b border-gray-400">
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
