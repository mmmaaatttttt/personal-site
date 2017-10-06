import React from "react";
import stripFrontMatterAndCompile from "../utils/marksyCompiler";

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div>
      <h1>{post.frontmatter.title}</h1>
      <h2>{post.frontmatter.date}</h2>
      <div>{stripFrontMatterAndCompile(post.internal.content)}</div>
    </div>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      internal {
        content
      }
      frontmatter {
        title
        date
      }
    }
  }
`;
