import { Coffee, Github } from "lucide-react";
import type { FC } from "react";
import BlueskyIcon from "@/components/icons/BlueskyIcon";

interface StoryActionsProps {
  githubUrl: string;
  blueskyUrl: string;
}

const StoryActions: FC<StoryActionsProps> = ({ githubUrl, blueskyUrl }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pb-12 not-prose">
      <a
        href="https://buymeacoffee.com/mattlane"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded bg-link px-5 py-3 text-sm font-semibold text-white hover:opacity-80"
      >
        <Coffee size={18} strokeWidth={1.5} />
        Buy me a coffee
      </a>
      <a
        href={blueskyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded border-2 border-link px-5 py-3 text-sm font-semibold text-link hover:opacity-80"
      >
        <BlueskyIcon size={18} />
        Share on Bluesky
      </a>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded border border-current px-5 py-3 text-sm text-gray-500 hover:opacity-80"
      >
        <Github size={18} strokeWidth={1.5} />
        Edit on GitHub
      </a>
    </div>
  );
};

export default StoryActions;
