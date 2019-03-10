const mdxFeed = require("gatsby-mdx/feed");

module.exports = {
  siteMetadata: {
    title: "Matt Lane",
    description: "Inside the mind of Matt Lane. Teacher, math doctor, lover of ice cream. Stories on the intersection of math, equity, games, and whatever else piques my interest.",
    siteUrl: process.env.GATSBY_BASE_URL
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/articles/`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `csvData`,
        path: `${__dirname}/src/data/csv`
      }
    },
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-110074252-1",
        anonymize: true
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: mdxFeed
    },
    {
      resolve: `gatsby-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1080,
              showCaptions: true
            }
          }
        ]
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-resolve-src`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-styled-components`
  ]
};
