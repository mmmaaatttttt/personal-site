import ColoredSpan from "@/components/story/shared/ColoredSpan";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import StyledTable from "@/components/story/shared/StyledTable";
import Caption from "@/components/story/shared/Caption";
import HorizontalBarGraph from "@/components/story/shared/HorizontalBarGraph";
import MultiBarGraph from "@/components/story/shared/MultiBarGraph";
import Legend from "@/components/story/shared/Legend";
import SliderProvider from "@/components/story/shared/Slider";

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
  CaptionWrapper: (props: any) => <Caption {...props} />,
  CenteredSVGText: (props: any) => <Placeholder name="CenteredSVGText" {...props} />,
  ClippedSVG: (props: any) => <Placeholder name="ClippedSVG" {...props} />,
  ColoredSpan: (props: any) => <ColoredSpan {...props} />,
  ColumnLayout: (props: any) => <Placeholder name="ColumnLayout" {...props} />,
  FlexContainer: (props: any) => <Placeholder name="FlexContainer" {...props} />,
  Icon: (props: any) => <Placeholder name="Icon" {...props} />,
  Latex: (props: any) => <span className="font-serif italic">{props.children}</span>,
  LinePlot: (props: any) => <Placeholder name="LinePlot" {...props} />,
  NarrowContainer: (props: any) => <NarrowContainer {...props} />,
  NoScrollCircle: (props: any) => <Placeholder name="NoScrollCircle" {...props} />,
  Polygon: (props: any) => <Placeholder name="Polygon" {...props} />,
  RelativeContainer: (props: any) => <div className="relative">{props.children}</div>,
  SVGBorder: (props: any) => <Placeholder name="SVGBorder" {...props} />,
  Strikethrough: (props: any) => <del>{props.children}</del>,
  StyledInput: (props: any) => <Placeholder name="StyledInput" {...props} />,
  StyledSelect: (props: any) => <Placeholder name="StyledSelect" {...props} />,
  StyledSlider: (props: any) => <Placeholder name="StyledSlider" {...props} />,
  StyledTable: (props: any) => <StyledTable {...props} />,
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
  MultiBarGraph: (props: any) => <MultiBarGraph {...props} />,
  HorizontalBarGraph: (props: any) => <HorizontalBarGraph {...props} />,
  Legend: (props: any) => <Legend {...props} />,

  // Stabilized Four Weddings Interactive Components
  SelectableHistogram: (props: any) => <SelectableHistogram {...props} />,
  SelectablePieChart: (props: any) => <SelectablePieChart {...props} />,
  SelectableScatterplot: (props: any) => <SelectableScatterplot {...props} />,
  SelectableUSMap: (props: any) => <SelectableUSMap {...props} />,

  // Providers (often wrap content)
  SliderProvider: (props: any) => <SliderProvider {...props} />,
};

import dynamic from "next/dynamic";
import Image from "next/image";

const WarmingDots = dynamic(() => import("@/content/stories/warming-dots/components/WarmingDots"));
const FourWeddingsVisualization = dynamic(() => import("@/content/stories/four-weddings/components/FourWeddingsVisualization"));

// Four Weddings components
const SelectableHistogram = dynamic(() => import("@/content/stories/four-weddings/components/SelectableHistogram"));
const SelectablePieChart = dynamic(() => import("@/content/stories/four-weddings/components/SelectablePieChart"));
const SelectableScatterplot = dynamic(() => import("@/content/stories/four-weddings/components/SelectableScatterplot"));
const SelectableUSMap = dynamic(() => import("@/content/stories/four-weddings/components/SelectableUSMap"));

// Beautiful Analysis components
const PodcastAllSentiments = dynamic(() => import("@/content/stories/beautiful-analysis/components/PodcastAllSentiments"));
const Quiz = dynamic(() => import("@/content/stories/beautiful-analysis/components/Quiz"));
const SelectableMultiBarGraph = dynamic(() => import("@/content/stories/beautiful-analysis/components/SelectableMultiBarGraph"));
const SentimentScoreTable = dynamic(() => import("@/content/stories/beautiful-analysis/components/SentimentScoreTable"));
const BaMultiBarGraph = dynamic(() => import("@/content/stories/beautiful-analysis/components/BaMultiBarGraph"));
const CommonPhrasesInteractive = dynamic(() => import("@/content/stories/beautiful-analysis/components/CommonPhrasesInteractive"));
const BaHorizontalBarGraph = dynamic(() => import("@/content/stories/beautiful-analysis/components/BaHorizontalBarGraph"));
const CollocationTable = dynamic(() => import("@/content/stories/beautiful-analysis/components/CollocationTable"));


export const MdxComponents: any = {
  ...story_components,
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
    <a className="text-link underline hover:text-orange transition-colors decoration-link/30" {...props} />
  ),
  hr: () => <hr className="my-12 border-gray-200" />,
  img: (props: any) => (
    <span className="my-12 block">
       <span className="relative block w-full overflow-hidden rounded-2xl bg-gray/5 shadow-md">
        <img
          src={props.src?.replace(/^(\.\.\/)+images\//, "/images/")}
          alt={props.alt || ""}
          className="mx-auto h-auto w-auto max-h-[600px] object-contain"
        />
      </span>
      {props.title && (
        <span className="mt-4 block text-center text-sm italic text-gray-500 font-medium">
          {props.title}
        </span>
      )}
    </span>
  ),
  WarmingDots: (props: any) => <WarmingDots {...props} />,
  FourWeddingsVisualization: (props: any) => <FourWeddingsVisualization {...props} />,
  PodcastAllSentiments: (props: any) => <PodcastAllSentiments {...props} />,
  Quiz: (props: any) => <Quiz {...props} />,
  SelectableMultiBarGraph: (props: any) => <SelectableMultiBarGraph {...props} />,
  SentimentScoreTable: (props: any) => <SentimentScoreTable {...props} />,
  CoinFlipTable: (props: any) => <Placeholder name="CoinFlipTable" />,
  // Specific to Beautiful Analysis
  BaMultiBarGraph: (props: any) => <BaMultiBarGraph {...props} />,
  CommonPhrasesInteractive: (props: any) => <CommonPhrasesInteractive {...props} />,
  BaHorizontalBarGraph: (props: any) => <BaHorizontalBarGraph {...props} />,
  CollocationTable: (props: any) => <CollocationTable {...props} />,
  table: (props: any) => (
    <div className="my-8 w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray/20 text-sm" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-nav/50 font-bold" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="border-b border-gray/10 hover:bg-nav/10" {...props} />,
  th: (props: any) => <th className="p-4 text-center first:text-left font-black uppercase tracking-wider" {...props} />,
  td: (props: any) => <td className="p-4 text-center first:text-left" {...props} />,
};
