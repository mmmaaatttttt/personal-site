import ColoredSpan from "@/components/story/shared/ColoredSpan";
import Latex from "@/components/story/shared/Latex";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import StyledTable from "@/components/story/shared/StyledTable";
import Caption from "@/components/story/shared/Caption";
import HorizontalBarGraph from "@/components/story/shared/HorizontalBarGraph";
import MultiBarGraph from "@/components/story/shared/MultiBarGraph";
import Legend from "@/components/story/shared/Legend";
import SliderProvider from "@/components/story/shared/Slider";
import Sidebar from "@/components/story/shared/Sidebar";

export const MdxComponents: any = {
  // Markdown element overrides
  h1: (props: any) => (
    <h1 className="mt-12 mb-6 text-3xl font-black" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mt-10 mb-4 text-2xl font-bold" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mt-8 mb-4 text-xl font-bold italic" {...props} />
  ),
  p: (props: any) => <p className="mb-6 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="mb-6 list-disc pl-6" {...props} />,
  ol: (props: any) => <ol className="mb-6 list-decimal pl-6" {...props} />,
  li: (props: any) => <li className="mb-2" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="mb-8 border-l-4 border-link bg-light-gray p-6 italic text-gray-700 underline-offset-4"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="text-link underline hover:text-orange transition-colors decoration-link/30"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-gray-200" />,
  img: (props: any) => (
    <span className="my-12 block">
      <span className="relative mx-auto block w-fit">
        <img
          src={props.src?.replace(/^(\.\.\/)+images\//, "/images/")}
          alt={props.alt || ""}
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
  table: (props: any) => (
    <div className="my-8 w-full overflow-x-auto">
      <table
        className="w-full border-collapse border border-gray/20 text-sm"
        {...props}
      />
    </div>
  ),
  thead: (props: any) => <thead className="bg-nav/50 font-bold" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => (
    <tr className="border-b border-gray/10 hover:bg-nav/10" {...props} />
  ),
  th: (props: any) => (
    <th
      className="p-4 text-center first:text-left font-black uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="p-4 text-center first:text-left" {...props} />
  ),

  // Globally shared story components (available in any MDX without importing)
  ColoredSpan: (props: any) => <ColoredSpan {...props} />,
  NarrowContainer: (props: any) => <NarrowContainer {...props} />,
  StyledTable: (props: any) => <StyledTable {...props} />,
  CaptionWrapper: (props: any) => <Caption {...props} />,
  HorizontalBarGraph: (props: any) => <HorizontalBarGraph {...props} />,
  MultiBarGraph: (props: any) => <MultiBarGraph {...props} />,
  Legend: (props: any) => <Legend {...props} />,
  SliderProvider: (props: any) => <SliderProvider {...props} />,
  Sidebar: (props: any) => <Sidebar {...props} />,
  Latex: (props: any) => <Latex {...props} />,
  Strikethrough: (props: any) => <del>{props.children}</del>,
  RelativeContainer: (props: any) => (
    <div className="relative">{props.children}</div>
  ),
  ResponsiveIFrame: ({ heightOverWidth: _heightOverWidth, ...props }: any) => (
    <div className="my-8 aspect-video w-full overflow-hidden rounded-xl bg-black/5">
      <iframe className="h-full w-full" {...props} />
    </div>
  ),
};
