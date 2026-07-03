// @vitest-environment node
import { render } from "react-email";
import { describe, expect, it } from "vitest";
import EmailFooter from "./EmailFooter";

describe("EmailFooter", () => {
  it("renders buy me a coffee and bluesky profile links", async () => {
    const html = await render(<EmailFooter />);
    expect(html).toContain("buymeacoffee.com/mattlane");
    expect(html).toContain("@mattlane.us");
  });

  it("does not render share on bluesky without shareUrl", async () => {
    const html = await render(<EmailFooter />);
    expect(html).not.toContain("Share on Bluesky");
  });

  it("renders share on bluesky when shareUrl is provided", async () => {
    const html = await render(
      <EmailFooter shareUrl="https://bsky.app/intent/compose?text=test" />,
    );
    expect(html).toContain("Share on Bluesky");
    expect(html).toContain("bsky.app/intent/compose");
  });

  it("does not render unsubscribe link without unsubscribeUrl", async () => {
    const html = await render(<EmailFooter />);
    expect(html).not.toContain("Unsubscribe");
  });

  it("renders unsubscribe link when provided", async () => {
    const html = await render(
      <EmailFooter unsubscribeUrl="https://unsubscribe.example.com" />,
    );
    expect(html).toContain("Unsubscribe");
    expect(html).toContain("https://unsubscribe.example.com");
  });
});
