import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import Figure from "@/components/story/shared/Figure";
import Legend from "@/components/story/shared/Legend";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Sidebar from "@/components/story/shared/Sidebar";
import StyledTable from "@/components/story/shared/StyledTable";
import { normalizeImagePath } from "@/utils/stringHelpers";

export const MdxComponents: Record<string, unknown> = {
  // Markdown element overrides
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mt-12 mb-6 text-3xl font-black" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-10 mb-4 text-2xl font-bold" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-4 mb-4 text-xl font-bold" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-6 last:mb-0 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-6 list-disc pl-6" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-6 list-decimal pl-6" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="mb-2" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mb-8 last:mb-0 bg-light-gray border-l-4 border-link pl-6 pr-6 py-4 italic text-gray-700"
      {...props}
    />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-link underline hover:text-orange transition-colors decoration-link/30"
      {...props}
    />
  ),
  hr: () => <hr className="my-2 border-gray-200" />,
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <span className="my-12 block">
      <span className="relative mx-auto block w-fit">
        <Image
          src={normalizeImagePath(
            typeof props.src === "string" ? props.src : "",
          )}
          alt={props.alt || ""}
          width={800}
          height={600}
          className="block h-auto max-h-[600px] max-w-full object-contain"
        />
      </span>
      {props.title && (
        <span className="mt-2 block text-center text-sm font-bold text-gray-600">
          {props.title}
        </span>
      )}
    </span>
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-8 w-full overflow-x-auto">
      <table
        className="w-full border-collapse border border-gray/20 text-sm"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-nav/50 font-bold" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => <tbody {...props} />,
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="border-b border-gray/10 hover:bg-nav/10" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="p-4 text-center first:text-left font-black uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="p-4 text-center first:text-left" {...props} />
  ),

  // Globally shared story components (available in any MDX without importing)
  ColoredSpan: (props: ComponentPropsWithoutRef<typeof ColoredSpan>) => (
    <ColoredSpan {...props} />
  ),
  NarrowContainer: (
    props: ComponentPropsWithoutRef<typeof NarrowContainer>,
  ) => <NarrowContainer {...props} />,
  StyledTable: (props: ComponentPropsWithoutRef<typeof StyledTable>) => (
    <StyledTable {...props} />
  ),
  Figure: (props: ComponentPropsWithoutRef<typeof Figure>) => (
    <Figure {...props} />
  ),
  Legend: (props: ComponentPropsWithoutRef<typeof Legend>) => (
    <Legend {...props} />
  ),
  Sidebar: (props: ComponentPropsWithoutRef<typeof Sidebar>) => (
    <Sidebar {...props} />
  ),
  Strikethrough: ({ children }: { children?: ReactNode }) => (
    <del>{children}</del>
  ),
  RelativeContainer: ({ children }: { children?: ReactNode }) => (
    <div className="relative">{children}</div>
  ),
  ResponsiveIFrame: ({
    heightOverWidth: _heightOverWidth,
    ...props
  }: ComponentPropsWithoutRef<"iframe"> & { heightOverWidth?: number }) => (
    <div className="my-8 aspect-video w-full overflow-hidden rounded-xl bg-black/5">
      <iframe className="h-full w-full" {...props} />
    </div>
  ),
};
