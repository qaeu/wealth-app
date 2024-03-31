import GameUI from "./GameUI";
import CATEGORIES from "./Categories";

const Game = async () => {
  const startItem: string = "📎 a paperclip";
  const startCategory = {
    title: CATEGORIES[0].titles[0],
    breakpoint: CATEGORIES[0].breakpoint,
  };
  const startOptions: string[] = [
    "🍬 a gummy bear",
    "📝 a single sheet of A5 paper",
    "🌱 some carrot seeds",
    "🐜 an ant",
  ];

  return (
    <GameUI
      initItem={startItem}
      initCategory={startCategory}
      initOptions={startOptions}
    />
  );
};

export default Game;
