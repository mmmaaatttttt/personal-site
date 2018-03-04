import COLORS from "../utils/styles";
import { lighten } from "polished";
import { average } from "../utils/mathHelpers";
import { format } from "d3-format";

const selectOptionsHistogram = [
  {
    value: "budget",
    label: "Wedding Budget",
    accessor: d => d.budget,
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
    value: "budgetPerGuest",
    label: "Wedding Budget Per Guest",
    accessor: d => d.guests && d.budget / d.guests,
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
    value: "spouseAge",
    label: "Spouse Age",
    accessor: d => d.spouseAge,
    step: 2,
    format: ".0f"
  },
  {
    value: "ageGap",
    label: "Age Gap (Spouse Age - Bride Age)",
    accessor: d => d.spouseAge && d.spouseAge - d.age,
    step: 2,
    format: ".0f"
  }
];

const selectOptionsMap = [
  {
    value: "weddingCount",
    label: "Color by Number of Weddings",
    accessor: values => values.length,
    colors: [lighten(0.4, COLORS.RED), COLORS.RED]
  },
  {
    value: "avgBudget",
    label: "Color by Average Wedding Budget",
    accessor: values => average(values, d => d.budget),
    colors: [lighten(0.4, COLORS.RED), COLORS.RED]
  }
];

const __pieHelper = (data, rankKey) =>
  data.filter(d => d.ranking === 1).reduce(
    (totals, bride) => {
      totals[bride[rankKey] - 1]++;
      return totals;
    },
    [0, 0, 0, 0]
  );

const selectOptionsPieChart = [
  {
    value: "budget",
    label: "Rankings by Budget",
    chartValues: data => __pieHelper(data, "budgetRanking")
  },
  {
    value: "budgetPerGuest",
    label: "Rankings by Budget Per Guest",
    chartValues: data => __pieHelper(data, "budgetPerGuestRanking")
  },
  {
    value: "expGiven",
    label: "Rankings by Overall Experience Points Given",
    chartValues: data => __pieHelper(data, "expGivenRanking")
  },
  {
    value: "expReceived",
    label: "Rankings by Overall Experience Points Received",
    chartValues: data => __pieHelper(data, "expReceivedRanking")
  },
  {
    value: "expDiff",
    label: "Rankings by Experience Points Gap (Received - Given)",
    chartValues: data => __pieHelper(data, "expDiffRanking")
  }
];

const selectOptionsScatter = [];

const mapTooltipTitle = properties => properties.name;

const mapTooltipBody = properties => {
  const weddingCount = properties.values && properties.values.length;
  if (weddingCount) {
    const averageBudget = average(properties.values, d => d.budget);
    return [
      `Number of weddings: ${weddingCount}`,
      `Average Budget: ${format("$,.0f")(averageBudget)}`
    ];
  }
  return `No weddings for this state.`;
};

const selectOptions = {
  map: selectOptionsMap,
  histogram: selectOptionsHistogram,
  pie: selectOptionsPieChart,
  scatter: selectOptionsScatter
};

const tooltipHelpers = {
  map: {
    title: mapTooltipTitle,
    body: mapTooltipBody
  }
};

export { selectOptions, tooltipHelpers };
