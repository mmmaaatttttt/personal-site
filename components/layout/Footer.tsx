import React from "react";
import Link from "next/link";
import { Twitter, Github, BookOpen, Rss } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-gray bg-nav p-8 text-sm text-gray-600">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/terms" className="hover:text-link">
          Terms & Privacy
        </Link>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <a
            rel="license"
            href="http://creativecommons.org/licenses/by-nc/4.0/"
            className="shrink-0"
          >
            <img
              alt="Creative Commons License"
              className="h-[31px] w-[88px]"
              src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
            />
          </a>
          <span className="hidden text-xs sm:inline">
            Content licensed under CC-BY-NC (unless stated otherwise).
          </span>
        </div>

        <div className="flex gap-6">
          <a
            href="https://twitter.com/mmmaaatttttt"
            className="hover:text-link"
            aria-label="Twitter"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://github.com/mmmaaatttttt/personal-site"
            className="hover:text-link"
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.amazon.com/Power-Up-Unlocking-Hidden-Mathematics-Video/dp/0691161518"
            className="hover:text-link"
            aria-label="Book"
          >
            <BookOpen size={24} />
          </a>
          <a href="/rss.xml" className="hover:text-link" aria-label="RSS">
            <Rss size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
