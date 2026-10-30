"use client";

import Link from "next/link";
import { type FC, type MouseEvent, type PointerEvent, useRef } from "react";
import { cn } from "@/lib/utils";
import { clientToSvgPoint } from "@/utils/svgHelpers";

const DRAG_THRESHOLD = 4;

interface BubbleNodeProps {
  slug: string;
  title: string;
  imageHref: string;
  descriptionId: string;
  x: number;
  y: number;
  r: number;
  active: boolean;
  dimmed: boolean;
  onActivate: (slug: string) => void;
  onDeactivate: () => void;
  onGrab: (slug: string) => void;
  onGrabMove: (slug: string, point: { x: number; y: number }) => void;
  onRelease: (slug: string) => void;
}

interface Gesture {
  pointerId: number;
  touch: boolean;
  wasActive: boolean;
  startX: number;
  startY: number;
  dragged: boolean;
}

const BubbleNode: FC<BubbleNodeProps> = ({
  slug,
  title,
  imageHref,
  descriptionId,
  x,
  y,
  r,
  active,
  dimmed,
  onActivate,
  onDeactivate,
  onGrab,
  onGrabMove,
  onRelease,
}) => {
  const clipId = `bubble-clip-${slug}`;
  const gestureRef = useRef<Gesture | null>(null);

  const toSvgPoint = (event: PointerEvent<HTMLAnchorElement>) =>
    clientToSvgPoint(
      (event.currentTarget as unknown as SVGGraphicsElement).ownerSVGElement,
      event.clientX,
      event.clientY,
    );

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    gestureRef.current = {
      pointerId: event.pointerId,
      touch: event.pointerType !== "mouse",
      wasActive: active,
      startX: event.clientX,
      startY: event.clientY,
      dragged: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    onGrab(slug);
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const distance = Math.hypot(
      event.clientX - gesture.startX,
      event.clientY - gesture.startY,
    );
    if (distance > DRAG_THRESHOLD) gesture.dragged = true;
    const point = toSvgPoint(event);
    if (gesture.dragged && point) onGrabMove(slug, point);
  };

  const handlePointerUp = (event: PointerEvent<HTMLAnchorElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onRelease(slug);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "mouse") onActivate(slug);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "mouse" && !gestureRef.current) onDeactivate();
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    if (gesture?.dragged) {
      event.preventDefault();
      return;
    }
    if (gesture?.touch && !gesture.wasActive) {
      event.preventDefault();
      onActivate(slug);
    }
  };

  return (
    <Link
      href={`/stories/${slug}`}
      aria-label={title}
      aria-describedby={descriptionId}
      className="group cursor-grab touch-none select-none outline-none active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDragStart={(event) => event.preventDefault()}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => onActivate(slug)}
      onBlur={onDeactivate}
      onClick={handleClick}
    >
      <g transform={`translate(${x},${y})`}>
        <clipPath id={clipId}>
          <circle r={r} />
        </clipPath>
        <image
          href={imageHref}
          x={-r}
          y={-r}
          width={r * 2}
          height={r * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
          className={cn(
            "transition-[opacity,filter] duration-200",
            dimmed && "opacity-35 grayscale-[0.8]",
          )}
        />
        <circle r={r} className="fill-none stroke-white stroke-4" />
        <circle
          r={r + 6}
          className="fill-none stroke-link stroke-3 opacity-0 group-focus-visible:opacity-100"
        />
      </g>
    </Link>
  );
};

export default BubbleNode;
