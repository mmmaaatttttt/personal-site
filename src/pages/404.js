import React from "react";
import styled from "styled-components";
import Link from "gatsby-link";
import { rhythm } from "../utils/typography";
import images from "../utils/images";
import media from "../utils/media";

const Styled404 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: ${rhythm(1)};
`;

const StyledStoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  text-align: center;

  ${media.small`
    width: 100%;
  `};
`

const StyledImage = styled.img`
  border-radius: 8px;
  margin-bottom: 0;
  width: 75%;
  ${media.medium`
    width: 100%;
  `};
`

const Error404 = ({data}) => {
  const { node } = data.allMarkdownRemark.edges[0]
  const { slug } = node.fields;
  const {
    title,
    featured_image,
    caption
  } = node.frontmatter;
  return (
    <Styled404>
      <h1>Oh no! 😭</h1>
      <p>It seems like the page you're looking for doesn't exist.</p>
      <p>Please double-check your request and try again. Or, you're welcome to check out my latest story:</p>
      <StyledStoryWrapper>
        <Link to={slug}>
          <h3>{title}</h3>
          <StyledImage src={images[featured_image]} alt={caption} />
        </Link>
        <small>{caption}</small>
      </StyledStoryWrapper>
    </Styled404>
  )
};

export default Error404;

export const query = graphql`
  query LatestStoryQuery {
    allMarkdownRemark(limit:1 sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MMMM, YYYY")
            featured_image
            caption
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
