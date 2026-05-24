"use client";

import GamingRelationships from "@/components/story/shared/GamingRelationships";
import { linearVisData } from "../data";

interface Props {
  idx: number | string;
  caption?: string;
}

export default function LinearGamingRelationships({ idx, caption }: Props) {
  const i = typeof idx === "string" ? parseInt(idx, 10) : idx;
  const compact = i !== 0;
  return (
    <GamingRelationships
      visData={linearVisData[i]}
      caption={caption}
      compact={compact}
    />
  );
}
