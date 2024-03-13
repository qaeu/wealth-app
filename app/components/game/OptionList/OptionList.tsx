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
      {items.map((item, index) => (
        <button
          key={index}
          className="mx-2 my-2 px-4 py-2 bg-neutral-50 text-slate-900 rounded-md"
          onClick={onClickHandler}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default OptionList;
