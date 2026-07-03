// @vitest-environment node
import { render } from "react-email";
import { describe, expect, it } from "vitest";
import WelcomeEmail from "./Welcome";

describe("WelcomeEmail", () => {
  it("renders the greeting heading", async () => {
    const html = await render(<WelcomeEmail />);
    expect(html).toContain("What have you done");
  });

  it("renders the mattlane.us header", async () => {
    const html = await render(<WelcomeEmail />);
    expect(html).toContain("mattlane.us");
  });
});
