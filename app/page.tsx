"use client";
import PlaygroundPage from "./playground/page";
import PlaygroundLayout from "./playground/layout";
export default function Home() {

  return (
    <div className="">
      <header className="p-4 text-center">
        <h1 className="text-xl font-bold">Next.js UI Components</h1>
      </header>

      {/* Playground */}
      <main className="rounded-2xl flex-1 overflow-y-auto">
        <PlaygroundLayout>
          <PlaygroundPage/>
        </PlaygroundLayout>
      </main>
    </div>
  );
}