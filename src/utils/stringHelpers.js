const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const camelCaseToTitle = str =>
  capitalize(str.replace(/[A-Z]/g, c => ` ${c.toUpperCase()}`));

export { capitalize, camelCaseToTitle };
