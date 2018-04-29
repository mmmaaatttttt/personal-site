module.exports = {
  transform: {
    "^.+\\.jsx?$": "<rootDir>/test/transformer.js"
  },
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/.cache/"],
  moduleFileExtensions: ["jsx", "js"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text", "html"]
};
