import type { Point } from "@/types/geometry";

export const WIDTH = 280;
export const HEIGHT = 240;
export const PADDING = 28;

export const VERTEX_GOLD: Point = { x: WIDTH / 2, y: PADDING };
export const VERTEX_BLACK: Point = { x: PADDING, y: HEIGHT - PADDING };
export const VERTEX_SILVER: Point = { x: WIDTH - PADDING, y: HEIGHT - PADDING };

export const POINT_RADIUS = 8;

export const MIN_TIER_WEIGHT = 0.01;
export const SNAP_RADIUS = 6;
export const MARKER_ARM = 5;
