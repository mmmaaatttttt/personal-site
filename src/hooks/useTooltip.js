import React, { useState, useCallback } from "react";
import { Tooltip } from "story_components";

function useTooltip() {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const hide = useCallback(() => setVisible(false), [setVisible]);

  const show = useCallback(
    (newTitle, newBody, newX, newY) => {
      setVisible(true);
      setCoords({ x: newX, y: newY });
      setTitle(newTitle);
      setBody(newBody);
    },
    [setVisible, setCoords, setTitle, setBody]
  );

  const renderTooltip = useCallback(
    () => (
      <Tooltip
        visible={visible}
        x={coords.x}
        y={coords.y}
        title={title}
        body={body}
      />
    ),
    [visible, coords, title, body]
  );

  return [renderTooltip, show, hide];
}

export default useTooltip;
