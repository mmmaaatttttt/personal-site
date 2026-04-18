declare module "*.mdx" {
  import type { ComponentType } from "react";
  const Component: ComponentType<any>;
  export default Component;
}

declare module "mdx/types" {
  import type { ComponentType, ReactNode } from "react";
  export type MDXComponents = Record<string, ComponentType<any>>;
  export type MDXProps = { children?: ReactNode; components?: MDXComponents };
}
