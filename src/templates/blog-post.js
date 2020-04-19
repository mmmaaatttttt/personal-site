import React from "react";
import styled from "styled-components";
import { graphql } from "gatsby";
import { Share } from "react-twitter-widgets";
import { Helmet } from "react-helmet";
import { MDXProvider } from "@mdx-js/react";
import Img from "gatsby-image";
import MainLayout from "layouts/MainLayout";
import RelatedStories from "layouts/RelatedStories";
import { FlexContainer } from "story_components";
import { sizes, fadeIn } from "utils/styles";
import { rhythm } from "utils/typography";
import media from "utils/media";
import renderer from "utils/mdxHelpers";

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

  figcaption.gatsby-resp-image-figcaption {
    text-align: center;
    font-weight: 700;
    font-size: 85%;
  }

  figure {
    margin-left: auto;
    margin-right: auto;
  }

  figure.w-60 > a {
    width: 60%;
    margin: 0 auto;
  }

  figure.w-70 > a {
    width: 70%;
    margin: 0 auto;
  }

  figure.w-80 > a {
    width: 80%;
    margin: 0 auto;
  }

  ${media.extraSmall`
    figure.w-60 > a,
    figure.w-70 > a,
    figure.w-80 > a {
      width: 100%;
    }
  `}
`;

const StyledMainImageWrapper = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  margin-top: -${rhythm(1.5)};

  .gatsby-image-wrapper {
    position: absolute !important;
    width: 100%;
    top: 0;
  }
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

function BlogPost({ location, data, children }) {
  const slug = location.pathname;
  const { title, siteUrl } = data.site.siteMetadata;
  const {
    featured_image,
    caption,
    date,
    featured_image_caption,
    outline,
    tags,
    title: postTitle,
  } = data.mdx.frontmatter;
  const fullTitle = `${postTitle} - ${title}`;
  const githubBase =
    "https://github.com/mmmaaatttttt/personal-site/blob/master/src/pages/stories";
  const githubUrl = `${githubBase}${slug.slice(0, -1)}.mdx`;
  const { fluid } = featured_image.childImageSharp;
  return (
    <MainLayout location={location} outline={outline}>
      <StyledPostWrapper>
        <Helmet>
          <title>{fullTitle}</title>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={fullTitle} />
          <meta name="twitter:description" content={caption} />
          <meta name="twitter:image" content={`${siteUrl}${fluid.src}`} />
          <meta property="og:title" content={fullTitle} />
          <meta property="og:description" content={caption} />
          <meta property="og:image" content={`${siteUrl}${fluid.src}`} />
          <meta property="og:url" content={`${siteUrl}${slug}`} />
        </Helmet>
        <StyledMainImageWrapper>
          <Img fluid={fluid} alt={`Main image for ${postTitle}`} />
          <StyledTitleWrapper>
            <h1>{postTitle}</h1>
            <h2>{date}</h2>
          </StyledTitleWrapper>
        </StyledMainImageWrapper>
        <StyledImageCaption>{featured_image_caption}</StyledImageCaption>
        <StyledTextWrapper>
          <MDXProvider components={renderer}>
            {children}
          </MDXProvider>
          <FlexContainer main="space-between">
            <small>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <em>Edit this story on GitHub</em>
              </a>
            </small>
            <Share
              url={`${siteUrl}${slug}`}
              options={{
                size: "large",
                via: "mmmaaatttttt",
                text: postTitle,
              }}
            />
          </FlexContainer>
          <RelatedStories currentTags={tags} id={slug} />
        </StyledTextWrapper>
      </StyledPostWrapper>
    </MainLayout>
  );
}

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date(formatString: "MMMM YYYY")
        featured_image {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        outline
        caption
        featured_image_caption
        tags
      }
    }
  }
`;

export default BlogPost;
