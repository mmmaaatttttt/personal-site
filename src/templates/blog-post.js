import React from "react";
import stripFrontMatterAndCompile from "../utils/marksyCompiler";
import styled from "styled-components";
import { sizes } from "../utils/styles";
import images from "../utils/images";

const StyledBlogWrapper = styled.div`
  max-width: ${sizes.maxWidthContent}; 
`


export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <StyledBlogWrapper>
      <img src={images[post.frontmatter.featured_image]} alt=""/>
      <h1>{post.frontmatter.title}</h1>
      <h2>{post.frontmatter.date}</h2>
      <div>{stripFrontMatterAndCompile(post.internal.content)}</div>
    </StyledBlogWrapper>
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
        featured_image
      }
    }
  }
`;
