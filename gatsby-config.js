const mdxFeed = require("gatsby-mdx/feed");

module.exports = {
  siteMetadata: {
    title: "Matt Lane",
    description: "Inside the mind of Matt Lane.",
    siteUrl: process.env.GATSBY_BASE_URL
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/articles/`
      },
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
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
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-resolve-src`,
    `gatsby-mdx`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`
  ]
};
