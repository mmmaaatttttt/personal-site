import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import TableOfContents from ".";

const headings = [
  { text: "Section One", id: "section-one" },
  { text: "Section Two", id: "section-two" },
];

describe("TableOfContents — empty headings", () => {
  it("renders nothing when headings array is empty", () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("TableOfContents — Introduction link", () => {
  it("always prepends an Introduction link to #introduction", () => {
    render(<TableOfContents headings={headings} />);
    const introLinks = screen.getAllByRole("link", { name: "Introduction" });
    expect(introLinks.length).toBeGreaterThan(0);
    expect(introLinks[0]).toHaveAttribute("href", "#introduction");
  });

  it("Introduction appears before section links", () => {
    render(<TableOfContents headings={headings} />);
    const nav = screen.getByRole("navigation", { name: "Table of contents" });
    const links = nav.querySelectorAll("a");
    expect(links[0]).toHaveTextContent("Introduction");
    expect(links[1]).toHaveTextContent("Section One");
    expect(links[2]).toHaveTextContent("Section Two");
  });
});

describe("TableOfContents — desktop nav", () => {
  it("renders a nav with aria-label", () => {
    render(<TableOfContents headings={headings} />);
    expect(
      screen.getByRole("navigation", { name: "Table of contents" }),
    ).toBeInTheDocument();
  });

  it("renders the Contents label", () => {
    render(<TableOfContents headings={headings} />);
    expect(screen.getAllByText("Contents")[0]).toBeInTheDocument();
  });

  it("renders all links including Introduction in the nav", () => {
    render(<TableOfContents headings={headings} />);
    const nav = screen.getByRole("navigation", { name: "Table of contents" });
    const links = nav.querySelectorAll("a");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "#introduction");
    expect(links[1]).toHaveAttribute("href", "#section-one");
    expect(links[2]).toHaveAttribute("href", "#section-two");
  });

  it("renders an hr separator", () => {
    const { container } = render(<TableOfContents headings={headings} />);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });

  it("applies the left border accent", () => {
    render(<TableOfContents headings={headings} />);
    const nav = screen.getByRole("navigation", { name: "Table of contents" });
    expect(nav.className).toContain("border-l-[3px]");
    expect(nav.className).toContain("border-link");
  });
});

describe("TableOfContents — mobile details", () => {
  it("renders a details element", () => {
    render(<TableOfContents headings={headings} />);
    expect(document.querySelector("details")).toBeInTheDocument();
  });

  it("renders a summary with Contents text", () => {
    render(<TableOfContents headings={headings} />);
    expect(document.querySelector("summary")).toHaveTextContent("Contents");
  });

  it("renders all links including Introduction inside details", () => {
    render(<TableOfContents headings={headings} />);
    const details = document.querySelector("details")!;
    const links = details.querySelectorAll("a");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "#introduction");
    expect(links[1]).toHaveAttribute("href", "#section-one");
    expect(links[2]).toHaveAttribute("href", "#section-two");
  });
});

describe("TableOfContents — smooth scroll and URL hash", () => {
  const scrollIntoViewMock = vi.fn();
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    replaceStateSpy = vi.spyOn(window.history, "replaceState");
  });

  afterEach(() => {
    scrollIntoViewMock.mockReset();
    replaceStateSpy.mockRestore();
    // @ts-expect-error jsdom does not define scrollIntoView; clean up after each test
    delete Element.prototype.scrollIntoView;
  });

  it("scrolls smoothly to the target element on link click", () => {
    const target = document.createElement("span");
    target.id = "section-one";
    document.body.appendChild(target);

    render(<TableOfContents headings={headings} />);
    const nav = screen.getByRole("navigation", { name: "Table of contents" });
    fireEvent.click(nav.querySelector('a[href="#section-one"]')!);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
    document.body.removeChild(target);
  });

  it("does not throw when the target element does not exist in the DOM", () => {
    render(<TableOfContents headings={headings} />);
    const nav = screen.getByRole("navigation", { name: "Table of contents" });
    expect(() =>
      fireEvent.click(nav.querySelector('a[href="#section-one"]')!),
    ).not.toThrow();
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it("updates the URL hash when a link is clicked", () => {
    const target = document.createElement("span");
    target.id = "section-one";
    document.body.appendChild(target);

    render(<TableOfContents headings={headings} />);
    const nav = screen.getByRole("navigation", { name: "Table of contents" });
    fireEvent.click(nav.querySelector('a[href="#section-one"]')!);

    expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "#section-one");
    document.body.removeChild(target);
  });

  it("updates the URL hash even when the target element is missing", () => {
    render(<TableOfContents headings={headings} />);
    const nav = screen.getByRole("navigation", { name: "Table of contents" });
    fireEvent.click(nav.querySelector('a[href="#section-one"]')!);

    expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "#section-one");
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});
