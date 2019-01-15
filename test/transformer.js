const babelOptions = {
  presets: ["babel-preset-gatsby"],
  plugins: [
    [ "module-resolver", { root: ["./src"] } ]
  ]
}

module.exports = require("babel-jest").createTransformer(babelOptions)
