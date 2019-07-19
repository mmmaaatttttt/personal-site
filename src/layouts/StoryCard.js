import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Link from "gatsby-link";
import Img from "gatsby-image";
import { rhythm } from "utils/typography";
import media from "utils/media";
import COLORS from "utils/styles";

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
  padding: ${rhythm(0.75)} 0 0;
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

const TagBadge = styled.span`
  background-color: ${COLORS.GRAY};
  color: ${COLORS.WHITE};
  font-size: ${rhythm(0.35)};
  font-style: italic;
  cursor: not-allowed;
  margin: ${rhythm(0.1)};
  padding: ${rhythm(0.05)} ${rhythm(0.3)};
  border-radius: ${rhythm(0.3)};
`;

const TagContainer = styled.div`
  text-align: right;
`;

function StoryCard({
  caption,
  date,
  delay,
  direction,
  fluid,
  slug,
  tags,
  title,
  timeToRead
}) {
  return (
    <StyledStory
      className={direction && `animated bounceIn${direction}`}
      delay={delay}
    >
      <StyledLink to={slug}>
        <StyledImageWrapper>
          <Img fluid={fluid} alt={`Card for ${title}`} />
        </StyledImageWrapper>
        <StyledExcerptArea>
          <StyledTitle>{title}</StyledTitle>
          <StyledDate>
            {date} - {timeToRead} minute read
          </StyledDate>
          <p>{caption}</p>
        </StyledExcerptArea>
      </StyledLink>
      <TagContainer>
        {tags.map(tag => (
          <TagBadge key={tag}>{tag}</TagBadge>
        ))}
      </TagContainer>
    </StyledStory>
  );
}

StoryCard.propTypes = {
  caption: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired,
  direction: PropTypes.oneOf(["Left", "Right", null]),
  fluid: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  timeToRead: PropTypes.number.isRequired
};

StoryCard.defaultProps = {
  caption: "Default caption",
  date: "January 1970",
  delay: 0,
  direction: null,
  fluid: {},
  slug: "/stories/default-slug",
  tags: [],
  title: "Default title",
  timeToRead: 0
};

export default StoryCard;
