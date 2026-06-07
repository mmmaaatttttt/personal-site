import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage SSR", () => {
  it("returns default value via server snapshot during renderToString", () => {
    function TestComponent() {
      const [value] = useLocalStorage("ssr-key", "ssr-default");
      return <span>{String(value)}</span>;
    }
    const html = renderToString(<TestComponent />);
    expect(html).toContain("ssr-default");
  });
});
