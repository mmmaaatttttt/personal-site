import React from "react";
import styled from "styled-components";
import { graphql } from 'gatsby';
import { Share } from "react-twitter-widgets";
import { Helmet } from "react-helmet";
import MainLayout from "../layouts/MainLayout";
import { FlexContainer } from "story_components";
import stripFrontMatterAndCompile from "utils/marksyCompiler";
import { sizes, fadeIn } from "utils/styles";
import images from "utils/images";
import { rhythm } from "utils/typography";
import media from "utils/media";

const StyledPostWrapper = styled.div`
  width: 100%;
`;

const StyledTextWrapper = styled.div`
  max-width: ${sizes.maxWidthContent};
  margin: 0 auto;
  padding: ${rhythm(0.5)};

  table {
    table-layout: fixed;
  }

  th,
  td {
    text-align: center;
    border: 1px solid hsla(0, 0%, 0%, 0.12);
  }
`;

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
`;

const StyledImageCaption = styled.small`
  display: flex;
  justify-content: flex-end;
  margin: 0 ${rhythm(0.5)};
  font-style: italic;
  color: #7d7d7d;
`;

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
  text-align: center;
  animation: ${fadeIn} 1.5s 0.5s forwards;
  color: white;
  padding: ${rhythm(1)};
  text-shadow: 3px 3px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000,
    -1px 1px 1px #000, 1px 1px 1px #000;

  ${media.small`
    margin-top: ${rhythm(1)};

    h1 {
      font-size: ${rhythm(1)};
    }
    h2 {
      font-size: ${rhythm(0.75)};
    }
  `} ${media.extraSmall`
    h1 {
      font-size: ${rhythm(0.6)};
    }
    h2 {
      font-size: ${rhythm(0.45)};
    }
  `};
`;

export default ({ data, location }) => {
  const post = data.markdownRemark;
  const { title, siteUrl } = data.site.siteMetadata;
  const {
    featured_image,
    caption,
    date,
    featured_image_caption
  } = post.frontmatter;
  const postTitle = post.frontmatter.title;
  const fullTitle = `${postTitle} - ${title}`;
  const image = images[`featured_images/${featured_image}`];
  const githubUrl = `https://github.com/mmmaaatttttt/personal-site/blob/master/src/pages${location.pathname.slice(0, -1)}.md`
  return (
    <MainLayout location={location} >
      <StyledPostWrapper>
        <Helmet>
          <title>{fullTitle}</title>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={fullTitle} />
          <meta name="twitter:description" content={caption} />
          <meta name="twitter:image" content={`${siteUrl}${image}`} />
          <meta property="og:title" content={fullTitle} />
          <meta property="og:description" content={caption} />
          <meta property="og:image" content={`${siteUrl}${image}`} />
          <meta property="og:url" content={`${siteUrl}${location.pathname}`} />
        </Helmet>
        <StyledMainImage image={image}>
          <StyledTitleWrapper>
            <h1>{postTitle}</h1>
            <h2>{date}</h2>
          </StyledTitleWrapper>
        </StyledMainImage>
        <StyledImageCaption>{featured_image_caption}</StyledImageCaption>
        <StyledTextWrapper>
          {stripFrontMatterAndCompile(post.internal.content)}
          <FlexContainer main="space-between">
            <small>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer"><em>Edit this story on GitHub</em></a>
            </small>
            <Share
              url={`${siteUrl}${location.pathname}`}
              options={{
                size: "large",
                via: "mmmaaatttttt",
                text: postTitle
              }}
            />
          </FlexContainer>
        </StyledTextWrapper>
      </StyledPostWrapper>
    </MainLayout>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      internal {
        content
      }
      frontmatter {
        title
        date(formatString: "MMMM YYYY")
        featured_image
        caption
        featured_image_caption
      }
    }
  }
`;
