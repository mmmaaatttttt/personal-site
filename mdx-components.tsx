import { MdxComponents } from "@/components/mdx/MdxComponents";

export function useMDXComponents(
  components: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...MdxComponents,
    ...components,
  };
}
