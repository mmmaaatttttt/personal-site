import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { graphql } from "gatsby";
import MainLayout from "layouts/MainLayout";
import StoryCard from "layouts/StoryCard";
import { rhythm } from "utils/typography";
import media from "utils/media";
import { StyledSelect } from "story_components";

const StyledStoriesWrapper = styled.div`
  margin: ${rhythm(0.5)};
  display: flex;
  flex-direction: column;
  width: 60%;
  justify-content: flex-start;

  ${media.small`
    width: 100%;
  `}
`;

function _extractYear(nodeObj) {
  return +nodeObj.node.frontmatter.date.slice(-4);
}

function getSortedYearOptions(nodes) {
  const years = nodes.map(_extractYear);
  const yearOptions = Array.from(new Set(years), year => ({
    value: year,
    label: year
  }));
  return [{ value: "all", label: "All years" }, ...yearOptions];
}

function filterByYear(nodeObj, yearOption) {
  if (yearOption.value === "all") return true;
  if (_extractYear(nodeObj) === yearOption.value) return true;
  return false;
}

const Stories = ({ data, location }) => {
  const yearOptions = useMemo(() => getSortedYearOptions(data.allMdx.edges), [
    data
  ]);
  const [yearOption, setYearOption] = useState(yearOptions[0]);
  return (
    <MainLayout location={location}>
      <StyledStoriesWrapper>
        <StyledSelect
          flex="none"
          margin="0 0 1rem"
          options={yearOptions}
          value={yearOption}
          onChange={newOption => setYearOption(newOption)}
        />
        <div>
          {data.allMdx.edges
            .filter(nodeObj => filterByYear(nodeObj, yearOption))
            .map(({ node }, index) => (
              <StoryCard
                caption={node.frontmatter.caption}
                date={node.frontmatter.date}
                delay={index / 4}
                direction={index % 2 === 0 ? "Left" : "Right"}
                fluid={node.frontmatter.featured_image.childImageSharp.fluid}
                key={node.fields.slug}
                slug={node.fields.slug}
                tags={node.frontmatter.tags ? node.frontmatter.tags.sort() : []}
                title={node.frontmatter.title}
                timeToRead={node.timeToRead}
              />
            ))}
        </div>
      </StyledStoriesWrapper>
    </MainLayout>
  );
};

export default Stories;

export const query = graphql`
  query StoriesQuery {
    allMdx(
      sort: {
        fields: [frontmatter___date, frontmatter___tags]
        order: [DESC, ASC]
      }
    ) {
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
`;
