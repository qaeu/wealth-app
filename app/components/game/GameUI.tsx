"use client";

import { useState } from "react";
import { queryOptions, queryValue } from "../LLMAPI/ChatGPT";
import OptionList from "./OptionList/OptionList";
import CATEGORIES from "./Categories";

interface GameUIProps {
  initItem: string;
  initCategory: string;
  initOptions: string[];
  initPrompt: string;
}

interface GameState {
  currentItem: string;
  currentCategory: string;
  loopCount: number;
}

const GameUI: React.FC<GameUIProps> = ({
  initItem,
  initCategory,
  initOptions,
  initPrompt,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentItem: initItem,
    currentCategory: initCategory,
    loopCount: 0,
  });
  const [options, setOptions] = useState(initOptions);

  const valuePrompt: string =
    "Give a single number estimate in USD, for the value of (a jellybean):\n" +
    "0.1\n\n" +
    "Give a single number estimate in USD, for the value of (a brand new electric car):\n" +
    "35000\n\n" +
    "Give a single number estimate in USD, for the value of (an abandoned factory):\n" +
    "400000\n\n" +
    "Give a single number estimate in USD, for the value of (luxury car dealership franchise):\n" +
    "200000000\n\n" +
    "Give a single number estimate in USD, for the value of (" +
    gameState.currentItem +
    "):";

  const updateCategory = async () => {
    let newValue: number = 0;
    try {
      newValue = await queryValue(valuePrompt);
    } catch (error) {
      throw error;
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
    setGameState({
      currentItem: buttonText,
      currentCategory:
        gameState.loopCount % 2 == 1
          ? await updateCategory()
          : gameState.currentCategory,
      loopCount: gameState.loopCount + 1,
    });

    const prompt: string = initPrompt
      .replace("${item}", gameState.currentItem)
      .replace("${category}", gameState.currentCategory);
    try {
      const newItems: string[] = await queryOptions(prompt);
      setOptions(newItems);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const dialogue = [
    "You have " + gameState.currentItem + ". ",
    "Select an item to trade for:",
  ];

  return (
    <div className="z-10 max-w-5xl font-mono text-sm">
      <p className="my-10 border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl static w-auto rounded-xl border bg-gray-200 p-4">
        {dialogue.map((txt) => (
          <>
            {txt} <br />
          </>
        ))}
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
