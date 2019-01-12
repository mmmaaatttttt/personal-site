import React from "react";
import { graphql } from 'gatsby';
import styled from "styled-components";
import Link from "gatsby-link";
import MainLayout from "../layouts/MainLayout";
import { rhythm } from "utils/typography";
import images from "utils/images";
import COLORS from "utils/styles";
import media from "utils/media";

const StyledStoriesWrapper = styled.div`
  margin: ${rhythm(0.5)};
`;

const StyledTitle = styled.h4`
  margin-bottom: ${rhythm(1 / 4)};
`;

const StyledDate = styled.h6`
  color: ${COLORS.GRAY};

  ${media.small`
    margin-bottom: ${rhythm(1 / 4)};
  `};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;

  ${media.extraSmall`
    flex-direction: column;
  `};
`;

const StyledExcerptArea = styled.div`
  flex-direction: column;
  width: 60%;
  margin: 0 ${rhythm(0.5)};

  p {
    margin: 0;
    line-height: ${rhythm(0.9)};
    font-size: 80%;
  }

  ${media.small`
    width: 100%;
    * {
      font-size: 70%;
    }
  `};

  ${media.extraSmall`
    margin: ${rhythm(0.5)} 0 0;

    * {
      font-size: 100%;
    }
  `};
`;

const StyledImageWrapper = styled.div`
  width: ${rhythm(6)};

  img {
    border-radius: 8px;
    margin-bottom: 0;
    display: block;
  }

  ${media.extraSmall`
    width: 100%;
  `};
`;

const StyledStory = styled.div`
  border-bottom: 1px solid ${COLORS.GRAY};
  padding: ${rhythm(0.75)} 0;
  animation-delay: ${props => props.delay}s;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border: none;
  }

  ${media.extraSmall`
    margin: 0 ${rhythm(0.5)};
    padding-bottom: ${rhythm(0.5)};
  `};
`;

const Story = ({
  title,
  date,
  image,
  caption,
  slug,
  timeToRead,
  direction,
  delay
}) => (
  <StyledStory className={`animated bounceIn${direction}`} delay={delay}>
    <StyledLink to={slug}>
      <StyledImageWrapper>
        <img src={image} />
      </StyledImageWrapper>
      <StyledExcerptArea>
        <StyledTitle>{title}</StyledTitle>
        <StyledDate>
          {date} - {timeToRead} minute read
        </StyledDate>
        <p>{caption}</p>
      </StyledExcerptArea>
    </StyledLink>
  </StyledStory>
);

const Stories = ({ data, location }) => (
  <MainLayout location={location}>
    <StyledStoriesWrapper>
      {data.allMarkdownRemark.edges.map(({ node }, index) => (
        <Story
          key={node.fields.slug}
          title={node.frontmatter.title}
          date={node.frontmatter.date}
          image={images[`featured_images/${node.frontmatter.featured_image}`]}
          caption={node.frontmatter.caption}
          slug={node.fields.slug}
          timeToRead={node.timeToRead}
          direction={index % 2 === 0 ? "Left" : "Right"}
          delay={index / 4}
        />
      ))}
    </StyledStoriesWrapper>
  </MainLayout>
);

export default Stories;

export const query = graphql`
  query StoriesQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MMMM YYYY")
            featured_image
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
