import { BookOpen, Rss } from "lucide-react";
import Image from "next/image";
import type { FC } from "react";
import BlueskyIcon from "@/components/icons/BlueskyIcon";
import GithubIcon from "@/components/icons/GithubIcon";

const Footer: FC = () => {
  return (
    <footer className="relative z-10 border-t border-gray bg-nav py-4 px-8 text-sm text-gray-600">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <a
            rel="license"
            href="http://creativecommons.org/licenses/by-nc/4.0/"
            className="shrink-0"
          >
            <Image
              alt="Creative Commons License"
              width={88}
              height={31}
              src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
            />
          </a>
          <span className="hidden text-xs sm:inline">
            Content licensed under CC-BY-NC (unless stated otherwise).
          </span>
        </div>

        <div className="flex gap-6 text-link flex-wrap justify-center">
          <a
            href="https://bsky.app/profile/mattlane.us"
            className="hover:opacity-80"
            aria-label="Bluesky"
          >
            <BlueskyIcon size={28} />
          </a>
          <a
            href="https://github.com/mmmaaatttttt/personal-site"
            className="hover:opacity-80"
            aria-label="GitHub"
          >
            <GithubIcon strokeWidth={1.5} size={28} />
          </a>
          <a
            href="https://www.amazon.com/Power-Up-Unlocking-Hidden-Mathematics-Video/dp/0691161518"
            className="hover:opacity-80"
            aria-label="Book"
          >
            <BookOpen strokeWidth={1.5} size={28} />
          </a>
          <a href="/rss.xml" className="hover:opacity-80" aria-label="RSS">
            <Rss strokeWidth={1.5} size={28} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
