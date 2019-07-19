import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useStaticQuery, graphql } from "gatsby";
import { sortBy } from "lodash";
import { jaccardDistance } from "utils/arrayHelpers";
import StoryCard from "./StoryCard";

const StyledHeading = styled.h3`
  margin: 0;
`;

function RelatedStories({ currentTags, id, maxRelated }) {
  const {
    allMdx: { edges }
  } = useStaticQuery(
    graphql`
      query {
        allMdx {
          edges {
            node {
              frontmatter {
                tags
                title
                date(formatString: "MMMM YYYY")
                featured_image {
                  childImageSharp {
                    fluid(maxWidth: 500) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
                caption
              }
              fields {
                slug
              }
              timeToRead
            }
          }
        }
      }
    `
  );
  edges.forEach(nodeObj => {
    nodeObj.distance = jaccardDistance(
      nodeObj.node.frontmatter.tags,
      currentTags
    );
  });
  const sortedStories = sortBy(edges, "distance")
    .filter(({ node, distance }) => node.fields.slug !== id && distance < 1)
    .slice(0, maxRelated)
    .map(({ node }) => (
      <StoryCard
        caption={node.frontmatter.caption}
        date={node.frontmatter.date}
        fluid={node.frontmatter.featured_image.childImageSharp.fluid}
        key={node.fields.slug}
        slug={node.fields.slug}
        tags={node.frontmatter.tags ? node.frontmatter.tags.sort() : []}
        title={node.frontmatter.title}
        timeToRead={node.timeToRead}
      />
    ));

  return sortedStories.length ? (
    <div>
      <StyledHeading>Here are some other stories you may like:</StyledHeading>
      {sortedStories}
    </div>
  ) : null;
}

RelatedStories.propTypes = {
  currentTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string.isRequired,
  maxRelated: PropTypes.number.isRequired
};

RelatedStories.defaultProps = {
  currentTags: [],
  id: "id",
  maxRelated: 3
};

export default RelatedStories;
