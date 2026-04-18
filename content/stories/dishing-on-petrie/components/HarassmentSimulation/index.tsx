// Server component shell — no "use client".
// Importing a "use client" module from RSC gives an opaque client reference proxy,
// not the real function. compileMDX can't call a proxy with per-instance props, so
// all three <HarassmentSimulation idx={N} /> instances collapsed to idx=0.
// This shell is a real server function; RSC calls it for each instance with the
// correct props, which are then baked into the client element it returns.
import HarassmentSimulationClient from "./HarassmentSimulationClient";
import type { HarassmentSimulationProps } from "./HarassmentSimulationClient";

export default function HarassmentSimulation(props: HarassmentSimulationProps) {
  return <HarassmentSimulationClient {...props} />;
}
