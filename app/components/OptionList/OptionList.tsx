import { edgeServerAppPaths } from "next/dist/build/webpack/plugins/pages-manifest-plugin";

interface OptionListProps {
  items: string[];
}

const OptionList: React.FC<OptionListProps> = ({ items }) => {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <button
          key={index}
          className="mx-2 my-2 px-4 py-2 bg-neutral-50 text-slate-900 rounded-md"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default OptionList;
