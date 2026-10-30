"use client";

import { type FC, useRef } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import imageLoader from "@/lib/imageLoader";
import type { StoryMap } from "@/utils/content";
import { datelineFor } from "@/utils/formatHelpers";
import { normalizeImagePath } from "@/utils/stringHelpers";
import BubbleNode from "./BubbleNode";
import BubblePreview from "./BubblePreview";
import { useBubbleMap } from "./useBubbleMap";
import {
  placePreview,
  relatedScores,
  threadEndpoints,
  threadOpacity,
  threadWidth,
} from "./utils";

const BUBBLE_IMAGE_WIDTH = 640;

interface BubbleMapProps {
  storyMap: StoryMap;
}

const BubbleMap: FC<BubbleMapProps> = ({ storyMap }) => {
  const [stageRef, { width, height }] = useResizeObserver();
  const [previewRef, previewSize] = useResizeObserver();
  const lastActiveRef = useRef<string | null>(null);
  const { nodes, activeSlug, activate, startDrag, moveDrag, endDrag } =
    useBubbleMap(storyMap, { width, height });

  if (activeSlug) lastActiveRef.current = activeSlug;
  const previewSlug = lastActiveRef.current;

  const nodeBySlug = new Map(nodes.map((node) => [node.slug, node]));
  const articleBySlug = new Map(
    storyMap.points.map(({ article }) => [article.slug, article]),
  );
  const scores = activeSlug
    ? relatedScores(activeSlug, storyMap.links)
    : new Map<string, number>();
  const relatives = nodes.flatMap((node) => {
    const score = scores.get(node.slug);
    return score === undefined ? [] : [{ node, score }];
  });
  const activeNode = activeSlug ? nodeBySlug.get(activeSlug) : undefined;
  const previewNode = previewSlug ? nodeBySlug.get(previewSlug) : undefined;
  const previewPosition = previewNode
    ? placePreview(
        previewNode,
        relatives.map(({ node }) => node),
        previewSize,
        { width, height },
      )
    : { left: 0, top: 0 };

  return (
    <div
      ref={stageRef}
      className="relative w-full aspect-[16/11] max-sm:aspect-[3/4]"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 size-full overflow-visible"
      >
        <title>Similarity</title>
        {activeNode && (
          <g>
            {relatives.map(({ score, node }) => (
              <line
                key={`${activeNode.slug}-${node.slug}`}
                {...threadEndpoints(activeNode, node)}
                strokeWidth={threadWidth(score)}
                strokeOpacity={threadOpacity(score)}
                className="stroke-link animate-[fade-in_260ms_ease-out_both] [stroke-linecap:round]"
              />
            ))}
          </g>
        )}
        {storyMap.points.map(({ article }) => {
          const node = nodeBySlug.get(article.slug);
          if (!node) return null;
          return (
            <BubbleNode
              key={node.slug}
              slug={node.slug}
              title={article.title}
              imageHref={imageLoader({
                src: normalizeImagePath(article.featured_image),
                width: BUBBLE_IMAGE_WIDTH,
              })}
              descriptionId={`bubble-description-${node.slug}`}
              x={node.x}
              y={node.y}
              r={node.r}
              active={node.slug === activeSlug}
              dimmed={
                activeSlug !== null &&
                node.slug !== activeSlug &&
                !scores.has(node.slug)
              }
              onActivate={activate}
              onDeactivate={() => activate(null)}
              onGrab={startDrag}
              onGrabMove={moveDrag}
              onRelease={endDrag}
            />
          );
        })}
      </svg>
      <BubblePreview
        ref={previewRef}
        article={previewSlug ? articleBySlug.get(previewSlug) : undefined}
        visible={activeSlug !== null}
        left={previewPosition.left}
        top={previewPosition.top}
      />
      <div className="sr-only">
        {storyMap.points.map(({ article }) => (
          <p
            key={article.slug}
            id={`bubble-description-${article.slug}`}
          >{`${datelineFor(article)}. ${article.caption}`}</p>
        ))}
      </div>
    </div>
  );
};

export default BubbleMap;
