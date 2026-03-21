import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matt Lane",
  description:
    "Inside the mind of Matt Lane. Teacher, math doctor, lover of ice cream. Stories on the intersection of math, equity, games, and whatever else piques my interest.",
};

export default function Home() {
  return (
    <main className="fade-in flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Matt Lane</h1>
      <p className="max-w-[var(--max-w-content)] text-center text-lg text-dark-gray">
        Site modernization in progress. 🚧
      </p>

      {/* Color palette verification */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { name: "link", bg: "bg-link" },
          { name: "blue", bg: "bg-blue" },
          { name: "green", bg: "bg-green" },
          { name: "orange", bg: "bg-orange" },
          { name: "purple", bg: "bg-purple" },
          { name: "red", bg: "bg-red" },
          { name: "yellow", bg: "bg-yellow" },
          { name: "maroon", bg: "bg-maroon" },
        ].map(({ name, bg }) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <div className={`h-12 w-12 rounded-lg ${bg}`} />
            <span className="text-xs text-gray">{name}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
