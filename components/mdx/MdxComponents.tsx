import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Placeholder for interactive components until they are fully ported in Phase 3
const Placeholder = ({ name, children }: { name: string; children?: React.ReactNode }) => (
  <div className="my-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray bg-nav/20 p-8 text-center text-gray transition-colors hover:border-link hover:bg-nav/30">
    <p className="mb-2 font-bold uppercase tracking-widest text-dark-gray">
      {name} {children ? "Wrapper" : "Visualization"}
    </p>
    <p className="max-w-xs text-sm text-gray-500 mb-4">
      {children ? "This container component" : "This interactive visualization"} is arriving in Phase 3 of the modernization.
    </p>
    {children && <div className="w-full text-left p-4 bg-white/50 rounded-lg">{children}</div>}
  </div>
);

// Comprehensive mapping of all story_components used in the legacy MDX files
export const story_components = {
  // Atoms
  Alert: (props: any) => <Placeholder name="Alert" {...props} />,
  AspectRatioWrapper: (props: any) => <Placeholder name="AspectRatioWrapper" {...props} />,
  AxisLabel: (props: any) => <Placeholder name="AxisLabel" {...props} />,
  Button: (props: any) => <Placeholder name="Button" {...props} />,
  CaptionWrapper: (props: any) => <Placeholder name="CaptionWrapper" {...props} />,
  CenteredSVGText: (props: any) => <Placeholder name="CenteredSVGText" {...props} />,
  ClippedSVG: (props: any) => <Placeholder name="ClippedSVG" {...props} />,
  ColoredSpan: (props: any) => <span className="font-medium" style={{ color: props.color }}>{props.children}</span>,
  ColumnLayout: (props: any) => <Placeholder name="ColumnLayout" {...props} />,
  FlexContainer: (props: any) => <Placeholder name="FlexContainer" {...props} />,
  Icon: (props: any) => <Placeholder name="Icon" {...props} />,
  Latex: (props: any) => <span className="font-serif italic">{props.children}</span>,
  LinePlot: (props: any) => <Placeholder name="LinePlot" {...props} />,
  NarrowContainer: (props: any) => <div className="mx-auto max-w-2xl">{props.children}</div>,
  NoScrollCircle: (props: any) => <Placeholder name="NoScrollCircle" {...props} />,
  Polygon: (props: any) => <Placeholder name="Polygon" {...props} />,
  RelativeContainer: (props: any) => <div className="relative">{props.children}</div>,
  SVGBorder: (props: any) => <Placeholder name="SVGBorder" {...props} />,
  Strikethrough: (props: any) => <del>{props.children}</del>,
  StyledInput: (props: any) => <Placeholder name="StyledInput" {...props} />,
  StyledSelect: (props: any) => <Placeholder name="StyledSelect" {...props} />,
  StyledSlider: (props: any) => <Placeholder name="StyledSlider" {...props} />,
  StyledTable: (props: any) => <div className="overflow-x-auto my-8"><table className="w-full border-collapse" {...props} /></div>,
  TranslucentRect: (props: any) => <Placeholder name="TranslucentRect" {...props} />,
  
  // Molecules
  ResponsiveIFrame: (props: any) => (
    <div className="my-8 aspect-video w-full overflow-hidden rounded-xl bg-black/5">
      <iframe className="h-full w-full" {...props} />
    </div>
  ),
  Sidebar: (props: any) => (
    <aside className="my-8 rounded-r-lg border-l-4 border-link bg-nav p-6 text-sm italic text-dark-gray shadow-sm">
      {props.children}
    </aside>
  ),

  // Templates & Organisms (Visualizations)
  WarmingDots: (props: any) => <Placeholder name="WarmingDots" />,
  FourWeddingsVisualization: (props: any) => <Placeholder name="FourWeddingsVisualization" />,
  DistanceExplorer: (props: any) => <Placeholder name="DistanceExplorer" />,
  EconomySimulation: (props: any) => <Placeholder name="EconomySimulation" />,
  GamingRelationships: (props: any) => <Placeholder name="GamingRelationships" />,
  GerrymanderHistoricalMap: (props: any) => <Placeholder name="GerrymanderHistoricalMap" />,
  HarassmentSimulation: (props: any) => <Placeholder name="HarassmentSimulation" />,
  ManhattanCircle: (props: any) => <Placeholder name="ManhattanCircle" />,
  ManhattanPaths: (props: any) => <Placeholder name="ManhattanPaths" />,
  OrchardGame: (props: any) => <Placeholder name="OrchardGame" />,
  PAdicCalculator: (props: any) => <Placeholder name="p-adic Calculator" />,
  PAdicFractalDistance: (props: any) => <Placeholder name="p-adic Fractal Distance" />,
  RentDivision: (props: any) => <Placeholder name="RentDivision" />,
  SampleGerrymander: (props: any) => <Placeholder name="SampleGerrymander" />,
  VotingMap: (props: any) => <Placeholder name="VotingMap" />,
  PodcastAllSentiments: (props: any) => <Placeholder name="PodcastAllSentiments" />,
  Quiz: (props: any) => <Placeholder name="Quiz" />,
  SelectableMultiBarGraph: (props: any) => <Placeholder name="SelectableMultiBarGraph" />,
  SentimentScoreTable: (props: any) => <Placeholder name="SentimentScoreTable" />,
  MultiBarGraph: (props: any) => <Placeholder name="MultiBarGraph" />,
  HorizontalBarGraph: (props: any) => <Placeholder name="HorizontalBarGraph" />,
  
  // Providers (often wrap content)
  SliderProvider: (props: any) => <div className="my-8 p-4 border border-gray/20 rounded-lg">{props.children || props.render?.([0])}</div>,
};

export const MdxComponents = {
  ...story_components,
  h1: (props: any) => <h1 className="mb-8 mt-12 text-3xl font-bold tracking-tight sm:text-4xl" {...props} />,
  h2: (props: any) => <h2 className="mb-6 mt-10 text-2xl font-bold tracking-tight sm:text-3xl" {...props} />,
  h3: (props: any) => <h3 className="mb-4 mt-8 text-xl font-bold sm:text-2xl" {...props} />,
  p: (props: any) => <p className="my-6 leading-relaxed text-dark-gray" {...props} />,
  a: (props: any) => (
    <Link
      href={props.href}
      className="font-medium text-link underline decoration-link/30 underline-offset-4 hover:decoration-link"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props: any) => <ul className="my-6 list-disc pl-6 space-y-2" {...props} />,
  ol: (props: any) => <ol className="my-6 list-decimal pl-6 space-y-2" {...props} />,
  li: (props: any) => <li className="text-dark-gray" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="my-8 border-l-4 border-link/20 pl-6 italic text-gray-600 quote" {...props} />
  ),
  hr: () => <hr className="my-12 border-gray/20" />,
  table: (props: any) => (
    <div className="my-8 overflow-x-auto rounded-lg border border-gray/20">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-nav" {...props} />,
  th: (props: any) => <th className="border-b border-gray/20 px-4 py-3 font-bold" {...props} />,
  td: (props: any) => <td className="border-b border-gray/10 px-4 py-3" {...props} />,
  img: (props: any) => {
    const src = props.src?.replace(/^(\.\.\/)+images\//, "/images/");
    return (
      <figure className="my-12 flex flex-col items-center">
        <div className="relative w-full overflow-hidden rounded-2xl bg-gray/5 shadow-md">
           <img
            src={src}
            alt={props.alt || ""}
            title={props.title}
            className="h-auto w-full object-contain"
          />
        </div>
        {(props.alt || props.title) && (
          <figcaption className="mt-4 max-w-2xl px-4 text-center text-sm font-medium text-gray-500 italic">
            {props.title || props.alt}
          </figcaption>
        )}
      </figure>
    );
  },
};
