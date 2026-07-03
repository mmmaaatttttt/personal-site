// @vitest-environment node
import { render } from "react-email";
import { describe, expect, it } from "vitest";
import NewStoryEmail from "./NewStory";

describe("NewStoryEmail", () => {
  it("renders with default props", async () => {
    const html = await render(<NewStoryEmail />);
    expect(html).toContain("Awesome new story");
  });

  it("renders provided title and caption", async () => {
    const html = await render(
      <NewStoryEmail title="My Story" caption="A great caption" />,
    );
    expect(html).toContain("My Story");
    expect(html).toContain("A great caption");
  });

  it("links the story card to the provided url", async () => {
    const html = await render(
      <NewStoryEmail url="https://mattlane.us/stories/my-story/" />,
    );
    expect(html).toContain("https://mattlane.us/stories/my-story/");
  });

  it("constructs the bluesky share url from title and url", async () => {
    const html = await render(
      <NewStoryEmail
        title="My Story"
        url="https://mattlane.us/stories/my-story/"
      />,
    );
    const expectedParam = encodeURIComponent(
      "My Story https://mattlane.us/stories/my-story/",
    );
    expect(html).toContain(expectedParam);
  });
});
