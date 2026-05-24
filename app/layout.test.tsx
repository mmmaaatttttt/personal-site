import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Open_Sans: () => ({ variable: "--font-open-sans", className: "" }),
  Domine: () => ({ variable: "--font-domine", className: "" }),
}));

vi.mock("next/script", () => ({ default: () => null }));

import RootLayout, { metadata } from "./layout";

describe("RootLayout", () => {
  it("exports the correct page title", () => {
    expect(metadata.title).toBe("Matt Lane");
  });

  it("renders children inside the document", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>test child</p>
      </RootLayout>,
    );
    expect(html).toContain("test child");
  });

  it("includes the open-sans and domine font variables", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <span />
      </RootLayout>,
    );
    expect(html).toContain("--font-open-sans");
    expect(html).toContain("--font-domine");
  });
});
