import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center sm:py-32">
        <h1 className="mb-6 font-serif text-7xl font-black tracking-tighter sm:text-9xl animate-in slide-in-from-bottom-8 duration-700">
          Hi!
        </h1>
        <h2 className="mb-8 font-serif text-3xl font-bold sm:text-5xl delay-300 animate-in fade-in fill-mode-both duration-1000">
          I'm Matt.{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
        </h2>
        <p className="max-w-md text-lg text-gray-600 delay-700 animate-in fade-in fill-mode-both duration-1000">
          Use the nav bar to explore the site. You'll figure it out.
        </p>
      </div>
    </MainLayout>
  );
}
