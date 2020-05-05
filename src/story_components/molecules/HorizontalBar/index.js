import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import NodeGroup from "react-move/NodeGroup";
import { rhythm } from "utils/typography";
import COLORS from "utils/styles";
import { total } from "utils/mathHelpers";
import { useTooltip } from "hooks";

const BarContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  height: ${rhythm(0.5)};
  margin: ${rhythm(0.25)} 0;
  border: 1px solid ${COLORS.GRAY};
  display: flex;
  overflow: hidden;
`;

const BarTitle = styled.h4`
  text-align: center;
  margin-bottom: ${rhythm(0.25)};
`;

const defaultData = [
  {
    size: 1,
    color: COLORS.RED,
    tooltipText: "text"
  }
];

function HorizontalBar({ data = defaultData, title = "" }) {
  const widthTransition = useCallback(
    d => {
      const sizeTotal = total(data, d => d.size) || 1;
      const width = (d.size * 100) / sizeTotal;
      return { width: [width], timing: { duration: 300 } };
    },
    [data]
  );
  const tooltipBody = useMemo(() => data.map(d => d.tooltipText), [data]);
  const [renderTooltip, show, hide] = useTooltip();
  const handleShow = useCallback(
    e => {
      show("", tooltipBody, e.pageX, e.pageY);
    },
    [show, tooltipBody]
  );

  return (
    <div>
      {title ? <BarTitle>{title}</BarTitle> : null}
      <NodeGroup
        data={data}
        keyAccessor={(_, i) => i}
        start={() => ({ width: 0 })}
        enter={widthTransition}
        update={widthTransition}
      >
        {segments => (
          <BarContainer
            onMouseMove={handleShow}
            onMouseLeave={hide}
            onTouchMove={handleShow}
            onTouchEnd={hide}
          >
            {segments.map(
              ({ key, data: { color: backgroundColor }, state: { width } }) => (
                <div
                  style={{ width: `${width}%`, backgroundColor }}
                  key={key}
                />
              )
            )}
          </BarContainer>
        )}
      </NodeGroup>
      {renderTooltip()}
    </div>
  );
}

HorizontalBar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number,
      color: PropTypes.string,
      tooltipText: PropTypes.string
    })
  ),
  title: PropTypes.string
};

export default React.memo(HorizontalBar);
