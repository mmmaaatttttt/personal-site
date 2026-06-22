// @vitest-environment node
import { Preview, render, Text } from "react-email";
import { describe, expect, it } from "vitest";
import EmailLayout from "./EmailLayout";

describe("EmailLayout", () => {
  it("renders children", async () => {
    const html = await render(
      <EmailLayout preview={<Preview>Test</Preview>}>
        <Text>Hello world</Text>
      </EmailLayout>,
    );
    expect(html).toContain("Hello world");
  });

  it("renders preview content", async () => {
    const html = await render(
      <EmailLayout preview={<Preview>Preview text here</Preview>}>
        <Text>Content</Text>
      </EmailLayout>,
    );
    expect(html).toContain("Preview text here");
  });

  it("renders the mattlane.us header link", async () => {
    const html = await render(
      <EmailLayout preview={<Preview>Test</Preview>}>
        <Text>Content</Text>
      </EmailLayout>,
    );
    expect(html).toContain("https://mattlane.us");
    expect(html).toContain("mattlane.us");
  });
});
