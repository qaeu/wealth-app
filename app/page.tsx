import OptionList from "./components/OptionList/OptionList";

export default function Home() {
  const items = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl font-mono text-sm">
        <p className="my-10 border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl static w-auto rounded-xl border bg-gray-200 p-4">
          Placeholder text
        </p>
        <OptionList items={items} />
      </div>
    </main>
  );
}
