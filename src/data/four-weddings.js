import COLORS from "../utils/styles";
import { lighten } from "polished";
import { average } from "../utils/mathHelpers";
import { format } from "d3-format";

const selectOptionsHistogramOne = [
  {
    value: "cost",
    label: "Wedding Cost",
    accessor: d => d.cost,
    step: 10000,
    format: "$.2s"
  },
  {
    value: "guests",
    label: "Guest Count",
    accessor: d => d.guests,
    step: 50,
    format: ".0f"
  },
  {
    value: "costPerGuest",
    label: "Wedding Cost Per Guest",
    accessor: d => (d.guests ? d.cost / d.guests : null),
    step: 100,
    format: "$.0f"
  },
  {
    value: "age",
    label: "Bride Age",
    accessor: d => d.age,
    step: 2,
    format: ".0f"
  },
  {
    value: "ageGap",
    label: "Age Gap (Spouse Age - Bride Age)",
    accessor: d => (d.spouseAge ? d.spouseAge - d.age : null),
    step: 2,
    format: ".0f"
  }
];

const selectOptionsMap = [
  {
    value: "weddingCount",
    label: "Number of Weddings",
    accessor: values => values.length,
    colors: [lighten(0.375, COLORS.ORANGE), COLORS.ORANGE]
  },
  {
    value: "avgCost",
    label: "Average Wedding Cost",
    accessor: values => average(values, d => d.cost),
    colors: [lighten(0.45, COLORS.GREEN), COLORS.GREEN]
  }
];

const selectOptionsPieChart = [
  {
    value: "cost",
    label: "Rankings by Cost",
    accessor: () => {}
  },
  {
    value: "costPerGuest",
    label: "Rankings by Cost Per Guest",
    accessor: () => {}
  }
];

const mapTooltipTitle = properties => properties.name;

const mapTooltipBody = properties => {
  const weddingCount = properties.values && properties.values.length;
  if (weddingCount) {
    const averageCost = average(properties.values, d => d.cost);
    return [
      `Number of weddings: ${weddingCount}`,
      `Average Cost: ${format("$,.0f")(averageCost)}`
    ];
  }
  return `No weddings for this state.`;
};

const selectOptions = {
  map: selectOptionsMap,
  histogramOne: selectOptionsHistogramOne,
  pie: selectOptionsPieChart
};

const tooltipHelpers = {
  map: {
    title: mapTooltipTitle,
    body: mapTooltipBody
  }
};

export { selectOptions, tooltipHelpers };
