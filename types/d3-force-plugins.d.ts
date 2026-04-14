declare module "d3-force-bounce" {
  import { Force, SimulationNodeDatum } from "d3-force";

  export interface BounceForce<NodeDatum extends SimulationNodeDatum> extends Force<NodeDatum, any> {
    radius(val: (node: NodeDatum) => number): this;
    onImpact(cb: (node1: NodeDatum, node2: NodeDatum) => void): this;
  }

  export default function forceBounce<NodeDatum extends SimulationNodeDatum>(): BounceForce<NodeDatum>;
}

declare module "d3-force-surface" {
  import { Force, SimulationNodeDatum } from "d3-force";

  export interface SurfaceDefinition {
    from: { x: number; y: number };
    to: { x: number; y: number };
  }

  export interface SurfaceForce<NodeDatum extends SimulationNodeDatum> extends Force<NodeDatum, any> {
    surfaces(s: SurfaceDefinition[]): this;
    oneWay(val: boolean): this;
    radius(val: (node: NodeDatum) => number): this;
  }

  export default function forceSurface<NodeDatum extends SimulationNodeDatum>(): SurfaceForce<NodeDatum>;
}
