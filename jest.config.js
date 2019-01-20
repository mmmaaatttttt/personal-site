module.exports = {
  collectCoverage: true,
  coverageReporters: ["lcov", "text", "html"],
  moduleFileExtensions: ["jsx", "js"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/test/__mocks__/fileMock.js",
  },
  setupTestFrameworkScriptFile: "<rootDir>test/jest-setup.js",
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/.cache/"],
  transform: {
    "^.+\\.jsx?$": "<rootDir>/test/transformer.js"
  }
};
