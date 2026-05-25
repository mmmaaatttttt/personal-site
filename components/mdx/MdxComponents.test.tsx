import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));
vi.mock("@/utils/stringHelpers", () => ({
  normalizeImagePath: (p: string) => `/normalized${p}`,
}));
vi.mock("@/components/story/shared/Caption", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="caption">{children}</div>
  ),
}));
vi.mock("@/components/story/shared/ColoredSpan", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <span data-testid="colored-span">{children}</span>
  ),
}));
vi.mock("@/components/story/shared/Legend", () => ({
  default: () => <div data-testid="legend" />,
}));
vi.mock("@/components/story/shared/NarrowContainer", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="narrow-container">{children}</div>
  ),
}));
vi.mock("@/components/story/shared/Sidebar", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <aside data-testid="sidebar">{children}</aside>
  ),
}));
vi.mock("@/components/story/shared/StyledTable", () => ({
  default: () => <table data-testid="styled-table" />,
}));

import { MdxComponents } from "./MdxComponents";

type AnyFC = React.FC<Record<string, unknown>>;

const {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: UL,
  ol: OL,
  li: LI,
  blockquote: Blockquote,
  a: A,
  hr: HR,
  img: Img,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  ColoredSpan,
  NarrowContainer,
  StyledTable,
  Caption,
  Legend,
  Sidebar,
  Strikethrough,
  RelativeContainer,
  ResponsiveIFrame,
} = MdxComponents as Record<string, AnyFC>;

describe("MdxComponents — heading and text elements", () => {
  it("renders h1 with correct classes", () => {
    render(<H1>Heading 1</H1>);
    const el = screen.getByRole("heading", { level: 1 });
    expect(el).toHaveClass("text-3xl", "font-black");
    expect(el).toHaveTextContent("Heading 1");
  });

  it("renders h2", () => {
    render(<H2>Heading 2</H2>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Heading 2",
    );
  });

  it("renders h3", () => {
    render(<H3>Heading 3</H3>);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Heading 3",
    );
  });

  it("renders p", () => {
    render(<P>Paragraph text</P>);
    expect(screen.getByText("Paragraph text")).toBeInTheDocument();
  });

  it("renders ul with list-disc class", () => {
    const { container } = render(<UL>{null}</UL>);
    expect(container.querySelector("ul")).toHaveClass("list-disc");
  });

  it("renders ol with list-decimal class", () => {
    const { container } = render(<OL>{null}</OL>);
    expect(container.querySelector("ol")).toHaveClass("list-decimal");
  });

  it("renders li", () => {
    render(<LI>List item</LI>);
    expect(screen.getByText("List item")).toBeInTheDocument();
  });

  it("renders blockquote", () => {
    const { container } = render(<Blockquote>Quote</Blockquote>);
    expect(container.querySelector("blockquote")).toBeInTheDocument();
  });

  it("renders anchor with text-link class and href", () => {
    render(<A href="https://example.com">link text</A>);
    const link = screen.getByRole("link", { name: "link text" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveClass("text-link");
  });

  it("renders hr", () => {
    const { container } = render(<HR />);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });
});

describe("MdxComponents — img", () => {
  it("renders image with string src via normalizeImagePath", () => {
    render(<Img src="/test.jpg" alt="test image" />);
    expect(screen.getByAltText("test image")).toHaveAttribute(
      "src",
      "/normalized/test.jpg",
    );
  });

  it("renders image with non-string src using empty string fallback", () => {
    render(<Img src={undefined} alt="test image" />);
    expect(screen.getByAltText("test image")).toHaveAttribute(
      "src",
      "/normalized",
    );
  });

  it("renders title caption when title prop is provided", () => {
    render(<Img src="/test.jpg" alt="img" title="My Caption" />);
    expect(screen.getByText("My Caption")).toBeInTheDocument();
  });

  it("does not render title caption when title is absent", () => {
    render(<Img src="/test.jpg" alt="img" />);
    expect(screen.queryByText("My Caption")).not.toBeInTheDocument();
  });

  it("renders img with empty alt (covers alt || '' falsy branch)", () => {
    const { container } = render(<Img src="/test.jpg" alt="" />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });
});

describe("MdxComponents — table elements", () => {
  it("renders full table structure with all sub-elements", () => {
    render(
      <Table>
        <Thead>
          <Tr>
            <Th>Column Header</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Cell Value</Td>
          </Tr>
        </Tbody>
      </Table>,
    );
    expect(screen.getByText("Column Header")).toBeInTheDocument();
    expect(screen.getByText("Cell Value")).toBeInTheDocument();
  });

  it("renders tbody as a standalone element", () => {
    const { container } = render(
      <table>
        <Tbody>
          <tr>
            <td>cell</td>
          </tr>
        </Tbody>
      </table>,
    );
    expect(container.querySelector("tbody")).toBeInTheDocument();
  });
});

describe("MdxComponents — shared story components", () => {
  it("renders ColoredSpan", () => {
    render(<ColoredSpan color="red">colored text</ColoredSpan>);
    expect(screen.getByTestId("colored-span")).toHaveTextContent(
      "colored text",
    );
  });

  it("renders NarrowContainer", () => {
    render(<NarrowContainer width="50%">narrow content</NarrowContainer>);
    expect(screen.getByTestId("narrow-container")).toHaveTextContent(
      "narrow content",
    );
  });

  it("renders StyledTable", () => {
    render(<StyledTable data={[["a", "b"]]} />);
    expect(screen.getByTestId("styled-table")).toBeInTheDocument();
  });

  it("renders Caption", () => {
    render(<Caption>caption text</Caption>);
    expect(screen.getByTestId("caption")).toHaveTextContent("caption text");
  });

  it("renders Legend", () => {
    render(<Legend />);
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("renders Sidebar", () => {
    render(<Sidebar direction="right">side note</Sidebar>);
    expect(screen.getByTestId("sidebar")).toHaveTextContent("side note");
  });
});

describe("MdxComponents — special components", () => {
  it("renders Strikethrough as del element", () => {
    render(<Strikethrough>deleted text</Strikethrough>);
    const del = screen.getByText("deleted text");
    expect(del.tagName).toBe("DEL");
  });

  it("renders RelativeContainer as a relative div", () => {
    const { container } = render(<RelativeContainer>inner</RelativeContainer>);
    expect(container.querySelector(".relative")).toBeInTheDocument();
  });

  it("renders ResponsiveIFrame with src", () => {
    render(<ResponsiveIFrame src="https://example.com" />);
    expect(document.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://example.com",
    );
  });

  it("renders ResponsiveIFrame and ignores heightOverWidth prop", () => {
    render(
      <ResponsiveIFrame src="https://example.com" heightOverWidth={0.5} />,
    );
    const iframe = document.querySelector("iframe");
    expect(iframe).not.toHaveAttribute("heightOverWidth");
    expect(iframe).not.toHaveAttribute("heightoverwidth");
  });
});
