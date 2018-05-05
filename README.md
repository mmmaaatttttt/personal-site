# mattlane.us

Source code for Matt Lane's mathematical personal site.

### Live Site

[mattlane.us](https://mattlane.us)

### Setup

```sh
npm install
npm run develop
```

This is a static site built with [Gatsby.js](https://www.gatsbyjs.org/). If you have trouble setting up an installation locally, try checking out their docs.

### Writing Stories

To add a post, add a new markdown file in `src/pages/stories`. Each markdown file should begin with some YAML frontmatter with the following data:

* `title`
* `date`
* `featured_image`, which should match the filename of an image in the `featured_images` directory
* `caption`, a short description of the story which will appear on the `/stories` index page, as well as in any shares of the story on Facebook / Twitter.
* `featured_image_caption`, a caption for the featured image

All visualizations in stories are built using React.js. To add a visualization, you can write the root React component directly in the markdown file, using JSX syntax. All components used for visualizations in stories should live inside of `src/story_components`.

The site integrates [marksy](https://github.com/cerebral/marksy) for processing React components within the markdown. The app is configured to automatically import all components inside of `story_components` for use in markdown, so you as long as you write a component in that directory, you should be able to immediately reference in markdown!

### Deploying

The site is deployed to S3 with some Route53 and CloudFront sprinkled on top. The setup basically mirrors [this](http://benjamincongdon.me/blog/2017/06/13/Deploying-and-Deploying-a-Static-Site-to-AWS-with-S3-and-Cloudfront) article.

Because of this, the command to deploy the site `npm run deploy` is heavily dependent on this configuration. If you'd like to take this code and deploy using some other technology (e.g. GitHub Pages), you'll need to modify the `deploy` script in the `package.json`.

Enjoy!
