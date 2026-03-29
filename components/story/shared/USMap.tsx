"use client";

import React, { useMemo } from "react";
import { geoPath, geoAlbers } from "d3-geo";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import { feature } from "topojson-client";
import { motion, AnimatePresence } from "framer-motion";
import ClippedSVG from "./ClippedSVG";
import usTopo from "./us-topo.json";

interface USMapProps {
  colors: string[];
  data: any[];
  domain?: [number, number];
  fillAccessor: (properties: any) => number | null;
  getTooltipBody: (properties: any) => string | string[];
  getTooltipTitle: (properties: any) => string;
  id?: string;
  scale?: number;
  topoKey?: string;
  translate?: [number, number];
  onMouseMove?: (title: string, body: string | string[]) => (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseLeave?: () => void;
}

const USMap: React.FC<USMapProps> = ({
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
}) => {
  const projection = useMemo(() => {
    return geoAlbers().scale(scale).translate(translate);
  }, [scale, translate]);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // Merge data into topojson properties
  const geoData = useMemo(() => {
    const features = feature(usTopo as any, (usTopo as any).objects[topoKey] as any) as any;
    
    // Group data by state
    const dataByState: Record<string, any[]> = {};
    data.forEach(d => {
        if (!dataByState[d.state]) dataByState[d.state] = [];
        dataByState[d.state].push(d);
    });

    features.features.forEach((f: any) => {
        f.properties.values = dataByState[f.properties.name] || [];
    });

    return features.features;
  }, [data, topoKey]);

  const colorScale = useMemo(() => {
    const effectiveDomain = domain || (extent(
      geoData.filter((d: any) => d.properties.values && d.properties.values.length > 0),
      (d: any) => fillAccessor(d.properties)
    ) as [number, number]);

    return scaleLinear<string>().domain(effectiveDomain || [0, 1]).range(colors);
  }, [geoData, domain, colors, fillAccessor]);

  return (
    <div className="w-full">
      <ClippedSVG id={id} width={1600} height={900}>
        <g>
          <AnimatePresence>
            {geoData.map((d: any, i: number) => {
              const val = fillAccessor(d.properties);
              const hasData = d.properties.values && d.properties.values.length > 0 && val !== null;
              const fill = hasData ? colorScale(val!) : "#eeeeee";
              const title = getTooltipTitle(d.properties);
              const body = getTooltipBody(d.properties);

              return (
                <motion.path
                  key={d.id || i}
                  d={pathGenerator(d) || ""}
                  fill={fill}
                  stroke="white"
                  strokeWidth={4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, fill }}
                  transition={{ duration: 0.5, delay: i * 0.005 }}
                  onMouseMove={onMouseMove?.(title, body)}
                  onMouseLeave={onMouseLeave}
                  onTouchStart={onMouseMove?.(title, body)}
                  onTouchEnd={onMouseLeave}
                  whileHover={{ strokeWidth: 6, stroke: "#666", zIndex: 10 }}
                  className="cursor-pointer"
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
