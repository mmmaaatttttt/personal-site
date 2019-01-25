import React from "react";

const renderer = {
  p: props => {
    if (props.children.type === "figure") return <figure {...props.children.props} />
    return <p {...props} />;
  },
  a: props => <a target="_blank" rel="noopener noreferrer" {...props} />
};

export default renderer;
