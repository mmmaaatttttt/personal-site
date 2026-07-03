interface Window {
  turnstile: {
    render(
      container: HTMLElement,
      options: {
        sitekey: string;
        callback: (token: string) => void;
        appearance?: "always" | "execute" | "interaction-only";
      },
    ): string;
    reset(widgetId: string): void;
  };
  umami?: {
    track(eventName: string, eventData?: Record<string, unknown>): void;
  };
}

declare module "d3-force-bounce" {
  import type { Force, SimulationNodeDatum } from "d3-force";

  interface BounceForce<NodeDatum extends SimulationNodeDatum>
    extends Force<NodeDatum, undefined> {
    radius(val: (node: NodeDatum) => number): this;
    onImpact(cb: (node1: NodeDatum, node2: NodeDatum) => void): this;
  }

  export default function forceBounce<
    NodeDatum extends SimulationNodeDatum,
  >(): BounceForce<NodeDatum>;
}

declare module "d3-force-surface" {
  import type { Force, SimulationNodeDatum } from "d3-force";

  interface SurfaceDefinition {
    from: { x: number; y: number };
    to: { x: number; y: number };
  }

  interface SurfaceForce<NodeDatum extends SimulationNodeDatum>
    extends Force<NodeDatum, undefined> {
    surfaces(s: SurfaceDefinition[]): this;
    oneWay(val: boolean): this;
    radius(val: (node: NodeDatum) => number): this;
  }

  export default function forceSurface<
    NodeDatum extends SimulationNodeDatum,
  >(): SurfaceForce<NodeDatum>;
}

declare module "*.mdx" {
  import type { ComponentType } from "react";

  const Component: ComponentType<Record<string, unknown>>;
  export default Component;
}

declare module "mdx/types" {
  import type { ReactNode } from "react";
  export type MDXComponents = Record<string, unknown>;
  export type MDXProps = { children?: ReactNode; components?: MDXComponents };
}
