"use client";

import { useEffect, useState } from "react";
import { queryOptions, queryValue } from "../LLMAPI/ChatGPT";
import OptionList from "./OptionList/OptionList";
import CATEGORIES from "./Categories";
import { getOptionsPrompt, getValuePrompt } from "./Prompts";
import { init } from "next/dist/compiled/webpack/webpack";

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
  history: string[];
}

const GameUI: React.FC<GameUIProps> = ({
  initItem,
  initCategory,
  initOptions,
}) => {
  const loadSaveState = (): GameState => {
    let state = initState;
    const storedStateStr = localStorage.getItem("gameState");
    if (storedStateStr) {
      try {
        const storedState = JSON.parse(storedStateStr);
        state = storedState;
      } catch (error) {
        console.error(error);
      }
    }
    return state;
  };

  const setGameState = (newState: GameState) => {
    localStorage.setItem("gameState", JSON.stringify(newState));
    setActiveGameState(newState);
  };

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
        history: [...gameState.history, selectedItem],
      });
    } catch (error) {
      console.error(error);
      setGameState({ ...gameState, currentItem: oldItem });
    }
    setIsLoading(false);
  };

  const initState: GameState = {
    currentItem: initItem,
    currentCategory: initCategory,
    options: initOptions,
    loopCount: 0,
    history: [initItem],
  };

  const [isClient, setIsClient] = useState(false);
  const [gameState, setActiveGameState] = useState<GameState>(initState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setActiveGameState(loadSaveState());
  }, []);

  if (isClient) {
    document.title = gameState.currentItem;
  }

  const dialogue = [
    `You have ${gameState.currentItem}. `,
    `Select an item to trade for:`,
  ];

  return (
    <div className="font-mono text-sm text-slate-900">
      <div className="z-10 max-w-lg ">
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
      <button
        className="border-t border-l border-gray-400 py-1 px-2 bg-transparent absolute bottom-0 right-0"
        onClick={() => setGameState(initState)}
      >
        Reset
      </button>
    </div>
  );
};

export default GameUI;
