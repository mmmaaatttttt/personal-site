import type { Metadata } from "next";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import matt from "./matt.jpg";

export const metadata: Metadata = {
  title: "About | Matt Lane",
  description: "About Matt Lane. Teacher, math doctor, lover of ice cream.",
};

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[var(--max-w-content)] px-4 sm:px-0 pt-10 mb-16 opacity-0 animate-[fade-in_2s_ease-out_0.5s_forwards]">
        <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-[#1a1a1a]">
          About Matt Lane
        </h1>

        {/* Headshot — Mobile: inline circle. Desktop: fixed bleeding circle in bottom-right */}
        <div className="pointer-events-none relative w-full text-center sm:fixed sm:-bottom-24 sm:-right-24 sm:-z-10 sm:w-auto sm:text-left">
          <Image
            src={matt}
            alt="Matt's face"
            className="inline-block aspect-square object-cover rounded-full border-link opacity-100 sm:opacity-30 border-4 sm:border-[8px] w-48 sm:w-[500px]"
            placeholder="blur"
          />
        </div>

        <div className="space-y-8 text-[#1a1a1a]">
          <p>
            Hi, I&apos;m Matt Lane. You may remember me from such organizations
            as{" "}
            <a
              href="https://www.rithmschool.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:opacity-80"
            >
              Rithm School
            </a>{" "}
            (which I co-founded in 2016),{" "}
            <a
              href="https://www.mathalicious.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:opacity-80"
            >
              Mathalicious
            </a>
            , or from my book,{" "}
            <a
              href="https://www.amazon.com/Power-Up-Unlocking-Hidden-Mathematics-Video/dp/0691161518"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:opacity-80"
            >
              Power-Up: Unlocking the Hidden Mathematics in Video Games
            </a>
            .
          </p>
          <p>
            Or, you may not know me at all. In which case, it&apos;s nice to
            meet you. I look forward to creating many wonderful memories
            together!
          </p>
          <p>
            A little bit about me: I received my Ph.D. in mathematics from UCLA
            in 2012. I love my family, problem solving, teaching, learning, and
            ice cream.
          </p>
          <p>
            The best way to reach me if you&apos;d like to chat more is{" "}
            <a
              href="https://bsky.app/profile/mattlane.us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:opacity-80"
            >
              Bluesky
            </a>
            . Because this is a cesspool-free corner of the internet, I
            don&apos;t enable comments on anything I write here.
          </p>
          <p>Take a look around, and let me know what you think!</p>
          <p className="text-right">
            <span role="img" aria-label="heart">
              ❤️
            </span>{" "}
            Matt
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
