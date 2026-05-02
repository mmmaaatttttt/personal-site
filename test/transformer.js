const path = require("node:path");
const babelJest = require("babel-jest");

module.exports = babelJest.createTransformer({
  configFile: path.resolve(".babelrc"),
});
