module.exports = {
  siteMetadata: {
    title: "Matt Lane"
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`
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
        trackingId: 'UA-110074252-1',
        anonymize: true
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-react-helmet`
  ]
};
