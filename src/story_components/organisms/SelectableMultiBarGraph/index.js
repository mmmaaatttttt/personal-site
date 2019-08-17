import React from "react";
import PropTypes from "prop-types";
import { max } from "d3-array";
import { SelectProvider } from "providers";
import { MultiBarGraph } from "story_components";
import { paddingType, selectType } from "utils/types";
import { total } from "utils/mathHelpers";

function SelectableMultiBarGraph({
  colors,
  containerWidth,
  data,
  getTooltipData,
  height,
  id,
  legendTitle,
  options,
  padding,
  width,
  yAxisLabel
}) {
  const yMax = max(data, d => {
    return max(d.counts, countObj => total(Object.values(countObj)));
  });
  return (
    <SelectProvider
      options={options}
      initialIndex={Math.floor(options[0].length / 2)}
      margin="0.5rem 0"
      render={([{ value }]) => {
        const dataForOption = data.map(obj => ({
          ...obj,
          counts: obj.counts[value]
        }));
        return (
          <MultiBarGraph
            colors={colors}
            containerWidth={containerWidth}
            data={dataForOption}
            getTooltipData={getTooltipData}
            height={height}
            id={id}
            legendTitle={legendTitle}
            padding={padding}
            width={width}
            yAxisLabel={yAxisLabel}
            yMax={yMax}
          />
        );
      }}
    />
  );
}

SelectableMultiBarGraph.propTypes = {
  containerWidth: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      meta: PropTypes.object.isRequired,
      counts: PropTypes.arrayOf(PropTypes.object).isRequired
    })
  ),
  colors: PropTypes.arrayOf(PropTypes.string.isRequired),
  height: PropTypes.number.isRequired,
  getTooltipData: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  legendTitle: PropTypes.string.isRequired,
  options: selectType,
  padding: paddingType,
  width: PropTypes.number.isRequired,
  yAxisLabel: PropTypes.string.isRequired
};

SelectableMultiBarGraph.defaultProps = {
  colors: ["red", "blue"],
  containerWidth: "60%",
  data: [
    {
      meta: {
        id: 1,
        title: "Episode",
        date: "8/10/2019"
      },
      counts: [
        {
          Chris: 0,
          Caller: 0
        }
      ]
    }
  ],
  getTooltipData: () => ({ title: "Title", body: "body" }),
  height: 400,
  id: "selectable-multi-bar-graph",
  legendTitle: "Legend",
  options: [[{ value: 0, label: "label" }]],
  padding: 0,
  width: 600,
  yAxisLabel: "Y axis label"
};

export default SelectableMultiBarGraph;
