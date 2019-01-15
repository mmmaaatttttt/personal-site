module.exports = {
  transform: {
    "^.+\\.jsx?$": "<rootDir>/test/transformer.js"
  },
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/.cache/"],
  setupTestFrameworkScriptFile: "<rootDir>test/jest-setup.js",
  snapshotSerializers: ["enzyme-to-json/serializer"],
  moduleFileExtensions: ["jsx", "js"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
  collectCoverage: true,
  coverageReporters: ["lcov", "text", "html"]
};
