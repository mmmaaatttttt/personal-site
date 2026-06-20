import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("@/components/layout/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("@/utils/content", () => ({
  getAllArticles: vi.fn().mockResolvedValue([]),
  getMetadataOptions: vi.fn().mockReturnValue({ years: [], tags: [] }),
}));
vi.mock("./ArticlesContent", () => ({
  default: () => <div data-testid="articles-content" />,
}));

import ArticlesPage from "./page";

describe("ArticlesPage", () => {
  it("renders the articles content", async () => {
    render(await ArticlesPage());
    expect(screen.getByTestId("articles-content")).toBeInTheDocument();
  });
});
