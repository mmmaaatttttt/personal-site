import { MdxComponents } from "@/components/mdx/MdxComponents";

export function useMDXComponents(
  components: Record<string, any>,
): Record<string, any> {
  return {
    ...MdxComponents,
    ...components,
  };
}
