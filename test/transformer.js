module.exports = require("babel-jest").createTransformer({
  presets: [
    [
      "env",
      {
        modules: "commonjs",
        targets: {
          node: "current"
        },
        exclude: ["transform-regenerator", "transform-es2015-typeof-symbol"]
      }
    ],
    "stage-0",
    "react"
  ],
  plugins: [
    "gatsby/dist/utils/babel-plugin-extract-graphql",
    "add-module-exports",
    "transform-object-assign"
  ]
});
