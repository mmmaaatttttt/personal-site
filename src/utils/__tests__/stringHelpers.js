import { capitalize } from "../stringHelpers";

describe("stringHelpers capitalize", () => {
  test("capitalizes a string", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });

  test("accepts empty string", () => {
    expect(capitalize("")).toBe("");
  });
});
