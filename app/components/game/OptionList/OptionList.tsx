"use client";

interface OptionListProps {
  items: string[];
  handleButtonClick: (event: any) => void;
}

const OptionList: React.FC<OptionListProps> = ({
  items,
  handleButtonClick,
}) => {
  const onClickHandler = async (event: any) => {
    const buttonText = (event.target as HTMLButtonElement).innerText;
    await handleButtonClick(buttonText);
  };

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <button
          key={i}
          className="mx-2 my-2 px-4 py-2 bg-gray-50 text-slate-900 rounded-md shadow transition-shadow hover:shadow-lg"
          onClick={onClickHandler}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default OptionList;
