import React from "react";
import { CaptionWrapper } from "story_components";

function withCaption(ComposedComponent) {
  return props => {
    const { caption, captionMarginTop, ...otherProps } = props;
    return (
      <CaptionWrapper caption={caption} captionMarginTop={captionMarginTop}>
        <ComposedComponent {...otherProps} />
      </CaptionWrapper>
    );
  };
}

export default withCaption;
