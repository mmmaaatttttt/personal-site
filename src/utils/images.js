function importAll(r) {
  let images = {};
  r.keys().forEach(item => images[item.replace("./", "")] = r(item));
  return images;
}

const images = importAll(
  require.context("../pages/images/", true, /\.(png|jpe?g|svg)$/)
);

export default images;
