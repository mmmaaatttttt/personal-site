import marksy from "marksy/components";
import React, { createElement } from "react";
import * as components from "../story_components";

const compile = marksy({
  createElement,
  components
});

const stripFrontMatterAndCompile = content => {
  content = content
    .split("---")
    .slice(2)
    .join("---");
  return compile(content).tree;
};

export default stripFrontMatterAndCompile;
