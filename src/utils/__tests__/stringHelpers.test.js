import { capitalize } from "utils/stringHelpers";

describe("stringHelpers", () => {
  describe("capitalize", () => {
    it("capitalizes a string", () => {
      expect(capitalize("hello world")).toBe("Hello world");
    });

    it("accepts empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });
});
