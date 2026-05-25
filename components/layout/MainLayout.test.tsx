import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));
vi.mock("@/hooks/useIsMounted", () => ({
  useIsMounted: vi.fn(),
}));
vi.mock("./Footer", () => ({
  default: () => <div data-testid="footer" />,
}));
vi.mock("./Navbar", () => ({
  default: ({
    hide,
    title,
    outline,
  }: {
    hide?: boolean;
    title: string;
    outline?: boolean;
  }) => (
    <nav
      data-testid="navbar"
      data-hide={String(hide)}
      data-title={title}
      data-outline={String(outline)}
    />
  ),
}));

import { usePathname } from "next/navigation";
import { useIsMounted } from "@/hooks/useIsMounted";
import MainLayout from "./MainLayout";

describe("MainLayout", () => {
  it("renders children, navbar, and footer", () => {
    vi.mocked(usePathname).mockReturnValue("/about");
    vi.mocked(useIsMounted).mockReturnValue(true);
    render(<MainLayout>Hello</MainLayout>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("applies opacity-0 class when not mounted", () => {
    vi.mocked(usePathname).mockReturnValue("/about");
    vi.mocked(useIsMounted).mockReturnValue(false);
    const { container } = render(<MainLayout>Content</MainLayout>);
    expect(container.firstChild).toHaveClass("opacity-0");
  });

  it("applies opacity-100 class when mounted", () => {
    vi.mocked(usePathname).mockReturnValue("/about");
    vi.mocked(useIsMounted).mockReturnValue(true);
    const { container } = render(<MainLayout>Content</MainLayout>);
    expect(container.firstChild).toHaveClass("opacity-100");
  });

  it("hides navbar on individual story pages", () => {
    vi.mocked(usePathname).mockReturnValue("/stories/my-story");
    vi.mocked(useIsMounted).mockReturnValue(true);
    render(<MainLayout>Content</MainLayout>);
    expect(screen.getByTestId("navbar")).toHaveAttribute("data-hide", "true");
  });

  it("does not hide navbar on the stories list page", () => {
    vi.mocked(usePathname).mockReturnValue("/stories/");
    vi.mocked(useIsMounted).mockReturnValue(true);
    render(<MainLayout>Content</MainLayout>);
    expect(screen.getByTestId("navbar")).toHaveAttribute("data-hide", "false");
  });

  it("does not hide navbar on non-story pages", () => {
    vi.mocked(usePathname).mockReturnValue("/about");
    vi.mocked(useIsMounted).mockReturnValue(true);
    render(<MainLayout>Content</MainLayout>);
    expect(screen.getByTestId("navbar")).toHaveAttribute("data-hide", "false");
  });

  it("passes outline prop to navbar", () => {
    vi.mocked(usePathname).mockReturnValue("/about");
    vi.mocked(useIsMounted).mockReturnValue(true);
    render(<MainLayout outline={true}>Content</MainLayout>);
    expect(screen.getByTestId("navbar")).toHaveAttribute(
      "data-outline",
      "true",
    );
  });

  it("handles null pathname gracefully without hiding the navbar", () => {
    vi.mocked(usePathname).mockReturnValue(null as unknown as string);
    vi.mocked(useIsMounted).mockReturnValue(true);
    render(<MainLayout>Content</MainLayout>);
    // null?.startsWith(...) === undefined (falsy), so isArticlePage is falsy
    expect(screen.getByTestId("navbar")).not.toHaveAttribute(
      "data-hide",
      "true",
    );
  });
});
