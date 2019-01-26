module.exports = {
  presets: ["babel-preset-gatsby"],
  plugins: [["module-resolver", { root: [`${__dirname}/src`] }]]
};
