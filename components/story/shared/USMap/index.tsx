import { extent } from "d3-array";
import { geoAlbers, geoPath } from "d3-geo";
import { scaleLinear } from "d3-scale";
import { AnimatePresence } from "framer-motion";
import type { FeatureCollection, Geometry } from "geojson";
import { type MouseEvent, type TouchEvent, useMemo } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import ClippedSVG from "../ClippedSVG";
import USState from "./USState";
import usTopoRaw from "./us-topo.json";

const usTopo = usTopoRaw as unknown as Topology;

interface MapProperties<T> {
  name: string;
  values: T[];
  [key: string]: string | number | boolean | T[] | undefined;
}

interface USMapProps<T> {
  colors: string[];
  data: T[];
  domain?: number[];
  fillAccessor: (properties: MapProperties<T>) => number | null;
  getTooltipBody: (properties: MapProperties<T>) => string | string[];
  getTooltipTitle: (properties: MapProperties<T>) => string;
  id?: string;
  scale?: number;
  topoKey?: "states" | "counties";
  translate?: [number, number];
  onMouseMove?: (
    title: string,
    body: string | string[],
  ) => (e: MouseEvent | TouchEvent) => void;
  onMouseLeave?: () => void;
}

const USMap = <T extends { state?: string }>({
  colors,
  data,
  domain,
  fillAccessor,
  getTooltipBody,
  getTooltipTitle,
  id = "us-map",
  scale = 1950,
  topoKey = "states",
  translate = [800, 460],
  onMouseMove,
  onMouseLeave,
}: USMapProps<T>) => {
  const projection = useMemo(() => {
    return geoAlbers().scale(scale).translate(translate);
  }, [scale, translate]);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // Merge data into topojson properties
  const geoData = useMemo(() => {
    const object = usTopo.objects[topoKey] as GeometryCollection<
      MapProperties<T>
    >;
    const features = feature(usTopo, object) as unknown as FeatureCollection<
      Geometry,
      MapProperties<T>
    >;

    // Group data by state
    const dataByState: Record<string, T[]> = {};
    data.forEach((d) => {
      const stateKey = d.state;
      if (stateKey) {
        if (!dataByState[stateKey]) dataByState[stateKey] = [];
        dataByState[stateKey].push(d);
      }
    });

    features.features.forEach((f) => {
      f.properties.values = dataByState[f.properties.name] || [];
    });

    return features.features;
  }, [data, topoKey]);

  const colorScale = useMemo(() => {
    const dataWithValues = geoData.filter(
      (d) => d.properties.values && d.properties.values.length > 0,
    );
    const effectiveDomain =
      domain ||
      (extent(dataWithValues, (d) => fillAccessor(d.properties)) as [
        number,
        number,
      ]);

    return scaleLinear<string>()
      .domain(effectiveDomain || [0, 1])
      .range(colors);
  }, [geoData, domain, colors, fillAccessor]);

  return (
    <div className="w-full">
      <ClippedSVG id={id} width={1600} height={900}>
        <g>
          <AnimatePresence>
            {geoData.map((d, i) => {
              const val = fillAccessor(d.properties);
              const hasData =
                d.properties.values &&
                d.properties.values.length > 0 &&
                val !== null;
              const fill =
                hasData && val !== null ? colorScale(val) : "#eeeeee";
              const title = getTooltipTitle(d.properties);
              const body = getTooltipBody(d.properties);

              return (
                <USState
                  key={d.id || i}
                  d={pathGenerator(d) || ""}
                  fill={fill}
                  index={i}
                  title={title}
                  body={body}
                  onMouseMove={onMouseMove}
                  onMouseLeave={onMouseLeave}
                />
              );
            })}
          </AnimatePresence>
        </g>
      </ClippedSVG>
    </div>
  );
};

export default USMap;
