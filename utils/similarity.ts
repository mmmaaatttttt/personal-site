import { createHash } from "node:crypto";
import { loadBindings, parse } from "next/dist/build/swc";
import { dot, type Vector } from "@/utils/mathHelpers";

interface Identifier {
  value: string;
}

interface AstNode {
  type: string;
  value?: string;
  expression?: AstNode;
  children?: AstNode[];
  opening?: {
    name: { type: string; object?: Identifier; property?: Identifier };
  };
}

const INLINE_TAGS = new Set(["a", "code", "del", "em", "strong", "sub", "sup"]);

function markdownTag(element: AstNode): string | null {
  const { name } = element.opening as NonNullable<AstNode["opening"]>;
  if (name.type !== "JSXMemberExpression") return null;
  return (name.object as Identifier).value === "_components"
    ? (name.property as Identifier).value
    : null;
}

function jsxText(node: AstNode): string {
  if (node.type === "JSXExpressionContainer") {
    const expression = node.expression as AstNode;
    return expression.type === "StringLiteral"
      ? (expression.value as string)
      : "";
  }
  if (node.type === "JSXFragment") return childrenText(node);
  const tag = markdownTag(node);
  if (tag === "pre") return "";
  const text = childrenText(node);
  return tag !== null && INLINE_TAGS.has(tag) ? text : ` ${text} `;
}

function childrenText(node: AstNode): string {
  return (node.children as AstNode[]).map(jsxText).join("");
}

function jsxRoots(node: unknown): AstNode[] {
  if (Array.isArray(node)) return node.flatMap(jsxRoots);
  if (node === null || typeof node !== "object") return [];
  const { type } = node as AstNode;
  if (type === "JSXElement" || type === "JSXFragment") return [node as AstNode];
  return Object.values(node).flatMap(jsxRoots);
}

export async function extractProse(source: string): Promise<string> {
  const bindings = await loadBindings();
  const code: string = await bindings.mdx.compile(source, { jsx: true });
  const ast = await parse(code, { filename: "story.jsx" });
  return jsxRoots(ast).map(jsxText).join(" ").replace(/\s+/g, " ").trim();
}

export function chunkWords(text: string, size: number): string[] {
  const words = text.split(" ").filter(Boolean);
  const chunks: string[] = [];
  for (let start = 0; start < words.length; start += size) {
    chunks.push(words.slice(start, start + size).join(" "));
  }
  return chunks;
}

export function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export function rankRelated(
  slugs: string[],
  vectors: Vector[],
  count: number,
): Record<string, string[]> {
  return Object.fromEntries(
    slugs.map((slug, index) => [
      slug,
      slugs
        .map((otherSlug, otherIndex) => ({
          slug: otherSlug,
          score: dot(vectors[index], vectors[otherIndex]),
        }))
        .filter((entry) => entry.slug !== slug)
        .sort(
          (first, second) =>
            second.score - first.score || first.slug.localeCompare(second.slug),
        )
        .slice(0, count)
        .map((entry) => entry.slug),
    ]),
  );
}

export interface SimilarPair {
  source: string;
  target: string;
  score: number;
}

export function similarPairs(
  slugs: string[],
  vectors: Vector[],
  cutoff: number,
): SimilarPair[] {
  const pairs: SimilarPair[] = [];
  for (let first = 0; first < slugs.length; first += 1) {
    for (let second = first + 1; second < slugs.length; second += 1) {
      const score = dot(vectors[first], vectors[second]);
      if (score >= cutoff) {
        pairs.push({
          source: slugs[first],
          target: slugs[second],
          score: Math.round(score * 1000) / 1000,
        });
      }
    }
  }
  return pairs;
}
