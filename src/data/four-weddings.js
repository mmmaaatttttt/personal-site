import COLORS from "utils/styles";
import { lighten } from "polished";
import { average } from "utils/mathHelpers";
import { format } from "d3-format";
import { scaleOrdinal } from "d3-scale";

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
    accessor: properties => properties.values.length,
    colors: [lighten(0.4, COLORS.RED), COLORS.RED]
  },
  {
    value: "avgBudget",
    label: "Color by Average Wedding Budget",
    accessor: properties => average(properties.values, d => d.budget),
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
    accessor: data => __pieHelper(data, "budgetRanking")
  },
  {
    value: "budgetPerGuest",
    label: "Rankings by Budget Per Guest",
    accessor: data => __pieHelper(data, "budgetPerGuestRanking")
  },
  {
    value: "expGiven",
    label: "Rankings by Overall Experience Points Given",
    accessor: data => __pieHelper(data, "expGivenRanking")
  },
  {
    value: "expReceived",
    label: "Rankings by Overall Experience Points Received",
    accessor: data => __pieHelper(data, "expReceivedRanking")
  },
  {
    value: "expDiff",
    label: "Rankings by Exp Gap (Received - Given)",
    accessor: data => __pieHelper(data, "expDiffRanking")
  }
];

const selectOptionsScatter = [
  {
    value: "budget",
    label: "Wedding Budget",
    accessor: d => d.budget,
    format: "$.2s"
  },
  {
    value: "guestCount",
    label: "Guest Count",
    accessor: d => d.guests,
    format: ".0f"
  },
  {
    value: "budgetPerGuest",
    label: "Budget Per Guest",
    accessor: d => d.guests && d.budget / d.guests,
    format: "$.0f"
  },
  {
    value: "brideAge",
    label: "Bride's Age",
    accessor: d => d.age,
    format: ".0f"
  },
  {
    value: "spouseAge",
    label: "Spouse's Age",
    accessor: d => d.spouseAge,
    format: ".0f"
  },
  {
    value: "ageGap",
    label: "Age Gap (Spouse Age - Bride Age)",
    accessor: d => d.spouseAge && d.spouseAge - d.age,
    format: ".0f"
  },
  {
    value: "totalPoints",
    label: "Total Points Received",
    accessor: d => {
      let total = 0;
      for (let key in d.scoresReceived) {
        total += d.scoresReceived[key];
      }
      return total;
    },
    format: ".0f"
  },
  {
    value: "expPointsReceived",
    label: "Overall Experience Points Received",
    accessor: d => d.scoresReceived.experience,
    format: ".0f"
  },
  {
    value: "expPointsGiven",
    label: "Overall Experience Points Given",
    accessor: d => d.scoresGiven.reduce((total, score) => total + score),
    format: ".0f"
  },
  {
    value: "expPointsGap",
    label: "Overall Exp Gap (Received - Given)",
    accessor: d =>
      d.scoresReceived.experience -
      d.scoresGiven.reduce((total, score) => total + score),
    format: ".0f"
  },
  {
    value: "dressScore",
    label: "Dress Score",
    accessor: d => d.scoresReceived.dress,
    format: ".0f"
  },
  {
    value: "foodScore",
    label: "Food Score",
    accessor: d => d.scoresReceived.food,
    format: ".0f"
  },
  {
    value: "venueScore",
    label: "Venue Score",
    accessor: d => d.scoresReceived.venue,
    format: ".0f"
  }
];

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

const graphOptions = {
  pie: {
    colorScale: scaleOrdinal().range([
      COLORS.BLUE,
      COLORS.GREEN,
      COLORS.ORANGE,
      COLORS.RED
    ])
  },
  scatter: {
    colorScale: scaleOrdinal()
      .domain([1, 2, 3, 4])
      .range([COLORS.BLUE, COLORS.GREEN, COLORS.ORANGE, COLORS.RED])
  }
};

export { selectOptions, tooltipHelpers, graphOptions };
