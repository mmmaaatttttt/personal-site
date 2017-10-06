import React from "react";
import styled from "styled-components";
import Link from "gatsby-link";
import { rhythm } from "../utils/typography";

const H1 = styled.h1`
  display: inline-block;
  border-bottom: 1px solid;
`;

const H3 = styled.h3`margin-bottom: ${rhythm(1 / 4)};`;

const Span = styled.span`color: #bbb;`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default ({ data }) => (
  <div>
    <H1>Amazing Pandas Eating Things</H1>
    <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <div>
        <StyledLink to={node.fields.slug}>
          <H3>
            {node.frontmatter.title} <Span>- {node.frontmatter.date}</Span>
          </H3>
          <p>{node.excerpt}</p>
        </StyledLink>
      </div>
    ))}
  </div>
);

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`;
