import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { flatten } from "lodash";
import { graphql } from "gatsby";
import MainLayout from "layouts/MainLayout";
import StoryCard from "layouts/StoryCard";
import { rhythm } from "utils/typography";
import media from "utils/media";
import Select from "react-select";

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

const StyledSelectArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & > div {
    margin-bottom: ${rhythm(0.75)};
    width: 49%;
  }

  ${media.small`
    & > div {
      width: 100%;
      margin-bottom: ${rhythm(0.25)};
    }
  `}
`;

function _extractYear(nodeObj) {
  return +nodeObj.node.frontmatter.date.slice(-4);
}

function getYearOptions(nodes) {
  const years = nodes.map(_extractYear);
  const yearOptions = Array.from(new Set(years), year => ({
    value: year,
    label: year
  }));
  return yearOptions;
}

function getTagOptions(nodes) {
  const tags = flatten(nodes.map(({ node }) => node.frontmatter.tags));
  const tagOptions = Array.from(new Set(tags))
    .sort()
    .map(tag => ({
      value: tag,
      label: tag
    }));
  return tagOptions;
}

function filterByYear(nodeObj, yearOption) {
  if (!yearOption) return true;
  return yearOption.value === _extractYear(nodeObj);
}

function filterByActiveTags({ node }, activeTags) {
  if (activeTags.length === 0) return true;
  for (let { value } of activeTags) {
    if (!node.frontmatter.tags.includes(value)) return false;
  }
  return true;
}

const Stories = ({ data, location }) => {
  const yearOptions = useMemo(() => getYearOptions(data.allMdx.edges), [data]);
  const tagOptions = useMemo(() => getTagOptions(data.allMdx.edges), [data]);
  const [yearOption, setYearOption] = useState(null);
  const [activeTags, setActiveTags] = useState([]);
  const matchingStories = data.allMdx.edges
    .filter(nodeObj => filterByYear(nodeObj, yearOption))
    .filter(nodeObj => filterByActiveTags(nodeObj, activeTags));

  return (
    <MainLayout location={location}>
      <StyledStoriesWrapper>
        <StyledSelectArea>
          <Select
            options={yearOptions}
            onChange={option => setYearOption(option)}
            isClearable
            placeholder="Filter by year..."
          />
          <Select
            options={tagOptions}
            onChange={tagsArr => setActiveTags(tagsArr)}
            isClearable
            isMulti
            placeholder="Filter by tag..."
          />
        </StyledSelectArea>
        <div>
          {matchingStories.length ? (
            matchingStories.map(({ node }, index) => (
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
            ))
          ) : (
            <p>
              No stories match your search. Try removing some of your filters.
            </p>
          )}
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
        fields: frontmatter___date
        order: DESC
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
