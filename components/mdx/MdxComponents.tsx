import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Caption from "@/components/story/shared/Caption";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import HorizontalBarGraph from "@/components/story/shared/HorizontalBarGraph";
import Latex from "@/components/story/shared/Latex";
import Legend from "@/components/story/shared/Legend";
import MultiBarGraph from "@/components/story/shared/MultiBarGraph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Sidebar from "@/components/story/shared/Sidebar";
import SliderProvider from "@/components/story/shared/Slider";
import StyledTable from "@/components/story/shared/StyledTable";

export const MdxComponents: Record<string, unknown> = {
  // Markdown element overrides
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mt-12 mb-6 text-3xl font-black" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-10 mb-4 text-2xl font-bold" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-4 text-xl font-bold italic" {...props} />
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
      className="mb-8 last:mb-0 border-l-4 border-link bg-light-gray p-6 italic text-gray-700 underline-offset-4"
      {...props}
    />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-link underline hover:text-orange transition-colors decoration-link/30"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-gray-200" />,
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <span className="my-12 block">
      <span className="relative mx-auto block w-fit">
        <Image
          src={(typeof props.src === "string" ? props.src : "").replace(
            /^(\.\.\/)+images\//,
            "/images/",
          )}
          alt={props.alt || ""}
          width={800}
          height={600}
          className="block h-auto max-h-[600px] max-w-full object-contain"
        />
      </span>
      {props.title && (
        <span className="mt-4 block text-center text-sm italic text-gray-500 font-medium">
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
  CaptionWrapper: (props: ComponentPropsWithoutRef<typeof Caption>) => (
    <Caption {...props} />
  ),
  HorizontalBarGraph: (
    props: ComponentPropsWithoutRef<typeof HorizontalBarGraph>,
  ) => <HorizontalBarGraph {...props} />,
  MultiBarGraph: (props: ComponentPropsWithoutRef<typeof MultiBarGraph>) => (
    <MultiBarGraph {...props} />
  ),
  Legend: (props: ComponentPropsWithoutRef<typeof Legend>) => (
    <Legend {...props} />
  ),
  SliderProvider: (props: ComponentPropsWithoutRef<typeof SliderProvider>) => (
    <SliderProvider {...props} />
  ),
  Sidebar: (props: ComponentPropsWithoutRef<typeof Sidebar>) => (
    <Sidebar {...props} />
  ),
  Latex: (props: ComponentPropsWithoutRef<typeof Latex>) => (
    <Latex {...props} />
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
