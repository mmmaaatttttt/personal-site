import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex-1 flex flex-col items-center justify-evenly text-center opacity-0 animate-[fade-in_2s_ease-out_0.5s_forwards]">
        <h1 className="font-serif text-[5rem] font-black leading-none">Hi!</h1>
        <h2 className="font-serif text-4xl font-bold leading-tight opacity-0 animate-[fade-in_1s_ease-out_1.5s_forwards]">
          I&apos;m Matt.{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
        </h2>
        <p className="max-w-md opacity-0 animate-[fade-in_1s_ease-out_2.5s_forwards]">
          Use the nav bar to explore the site. You&apos;ll figure it out.
        </p>
      </div>
    </MainLayout>
  );
}
