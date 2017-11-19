import React from "react";
import stripFrontMatterAndCompile from "../utils/marksyCompiler";
import styled from "styled-components";
import { sizes, fadeIn } from "../utils/styles";
import images from "../utils/images";
import { rhythm } from "../utils/typography";

const StyledPostWrapper = styled.div`
  width: 100%;
`

const StyledTextWrapper = styled.div`
  max-width: ${sizes.maxWidthContent};
  margin: 0 auto;
`

const StyledMainImage = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  height: 0;
  padding-top: 56.25%;
  margin-top: -${rhythm(1.5)};
  margin-bottom: ${rhythm(1)};
`

const StyledTitleWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: ${fadeIn} 2s 1s forwards;
  color: white;
  text-shadow: 3px 3px 1px #000,
     -1px -1px 1px #000,
      1px -1px 1px #000,
     -1px 1px 1px #000,
      1px 1px 1px #000;
`

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <StyledPostWrapper>
      <StyledMainImage image={images[post.frontmatter.featured_image]}>
        <StyledTitleWrapper>
          <h1>{post.frontmatter.title}</h1>
          <h2>{post.frontmatter.date}</h2>
        </StyledTitleWrapper>
      </StyledMainImage>
      <StyledTextWrapper>
        {stripFrontMatterAndCompile(post.internal.content)}
      </StyledTextWrapper>
    </StyledPostWrapper>
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
        date(formatString: "MMMM DD, YYYY")
        featured_image
      }
    }
  }
`;
