import React from "react";

/**
 * Checks if a given element is a figure.
 * This disables warnings in the console about <figure> elements
 * not being valid children of <p> elements.
 * Note that this also supports the addition of classes to the image by adding
 * the classnames inside of curly braces:
 * ![foo](image_url.jpg){.w-70}
 *
 * @param {Object} props
 */
const isFigure = props => {
  const isImgWithNoStyles =
    props.children.props && props.children.props.name === "figure";
  const isImgWithStyles =
    props.children.length === 2 &&
    props.children[0].props &&
    props.children[0].props.name === "figure" &&
    props.children[1].match(/^{.*}$/);
  return isImgWithNoStyles || isImgWithStyles;
};

/**
 * Given this enhanced markdown syntax:
 * ![foo](image_url.jpg){.w-70}
 * This helper will append class names in braces to the figure.
 *
 * @param {String} str - string of key-value pairs for styles
 */
const extractClasses = str =>
  str
    .slice(1, -1)
    .split(".")
    .join(" ")
    .trim();

const renderer = {
  p: props => {
    if (isFigure(props)) {
      if (!Array.isArray(props.children)) {
        return (
          <figure {...props.children.props.props}>
            {props.children.props.children}
          </figure>
        );
      }

      const childProps = props.children[0].props;
      return (
        <figure
          {...childProps.props}
          className={`${childProps.props.className} ${extractClasses(
            props.children[1]
          )}`}
        >
          {childProps.children}
        </figure>
      );
    }
    return <p {...props} />;
  },
  a: props => (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {props.children}
    </a>
  )
};

export default renderer;
